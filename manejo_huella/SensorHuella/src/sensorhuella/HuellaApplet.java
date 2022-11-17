package sensorhuella;

import com.digitalpersona.onetouch.*;
import com.digitalpersona.onetouch.capture.DPFPCapture;
import com.digitalpersona.onetouch.capture.event.DPFPDataAdapter;
import com.digitalpersona.onetouch.capture.event.DPFPDataEvent;
import com.digitalpersona.onetouch.capture.event.DPFPErrorAdapter;
import com.digitalpersona.onetouch.capture.event.DPFPErrorEvent;
import com.digitalpersona.onetouch.capture.event.DPFPReaderStatusAdapter;
import com.digitalpersona.onetouch.capture.event.DPFPReaderStatusEvent;
import com.digitalpersona.onetouch.capture.event.DPFPSensorAdapter;
import com.digitalpersona.onetouch.capture.event.DPFPSensorEvent;
import com.digitalpersona.onetouch.processing.DPFPEnrollment;
import com.digitalpersona.onetouch.processing.DPFPFeatureExtraction;
import com.digitalpersona.onetouch.processing.DPFPImageQualityException;
import com.digitalpersona.onetouch.verification.DPFPVerification;
import com.digitalpersona.onetouch.verification.DPFPVerificationResult;
import java.awt.BorderLayout;
import java.awt.Button;
import java.awt.Color;
import java.awt.Graphics;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Image;
import java.awt.Label;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.IOException;
import java.io.InputStream;
import javax.swing.JApplet;
import javax.swing.JPanel;
import javax.swing.SwingUtilities;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.content.ByteArrayBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.commons.codec.binary.Base64;

/**
 * Applet para la toma y envío de huellas dactilares
 * @author Feisar Moreno
 * @date 11/04/2014
 */
public class HuellaApplet extends JApplet {
    private static final String TEMPLATE_PROPERTY = "template";
    
    private long idUsuario;
    private byte[] huellaOri;
    private final DPFPCapture lector = DPFPGlobal.getCaptureFactory().createCapture();
    private final DPFPEnrollment reclutador = DPFPGlobal.getEnrollmentFactory().createEnrollment();
    private final DPFPVerification verificador = DPFPGlobal.getVerificationFactory().createVerification();
    
    private DPFPTemplate template;
    public DPFPFeatureSet featuresInscripcion;
    public DPFPFeatureSet featuresVerificacion;
    public Image image;
    private Button btnAgregar, btnComparar, btnReiniciar;
    private Label lblMensaje;
    
    /**
    * Initialization method that will be called after the applet is loaded into
    * the browser.
    */
    @Override
    public void init() {
        try {
            this.idUsuario = Long.parseLong(getParameter("id_usuario"));
        } catch (NumberFormatException ex) {
            this.idUsuario = 0L;
        }
        
        if (getParameter("huella") != null) {
            this.huellaOri = Base64.decodeBase64(getParameter("huella"));
        } else {
            this.huellaOri = new byte[0];
        }
        this.setSize(200, 235);
        
        JPanel controles = new JPanel();
        controles.setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.gridwidth = 2;
        this.lblMensaje = new Label("Tomas Faltantes: 4");
        this.lblMensaje.setBackground(Color.white);
        this.lblMensaje.setAlignment(Label.CENTER);
        controles.add(this.lblMensaje, gbc);
        
        gbc.gridwidth = 1;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.gridx = 0;
        gbc.gridy = 1;
        if (this.huellaOri.length == 0) {
            this.btnAgregar = new Button("Enviar huella");
            this.btnAgregar.addActionListener(new ListenerAgregar());
            controles.add(this.btnAgregar, gbc);
        } else {
            this.btnComparar = new Button("Verificar huella");
            this.btnComparar.addActionListener(new ListenerComparar());
            controles.add(this.btnComparar, gbc);
        }
        
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.gridx = 1;
        gbc.gridy = 1;
        this.btnReiniciar = new Button("Reiniciar");
        this.btnReiniciar.addActionListener(new ListenerReiniciar());
        controles.add(this.btnReiniciar, gbc);
        
        this.add(controles, BorderLayout.SOUTH);
        
        iniciar();
        starts();
    }
    
    @Override
    public void paint(Graphics g) {
        g.drawImage(this.image, 200, 200, -200, -200, this);
    }
    
    @Override
    public void stop() {
        this.lector.stopCapture();
    }
    
    @Override
    public void update(Graphics g) {
        paint(g);
    }
    
    public void iniciar() {
        this.lector.addDataListener(new DPFPDataAdapter() {
            @Override
            public void dataAcquired(final DPFPDataEvent e) {
                SwingUtilities.invokeLater(new Runnable() {
                    @Override
                    public void run() {
                        System.out.println("La Huella Digital ha sido Capturada");
                        procesarCaptura(e.getSample());
                        repaint();
                    }
                });
            }
        });
        
        this.lector.addReaderStatusListener(new DPFPReaderStatusAdapter() {
            @Override
            public void readerConnected(final DPFPReaderStatusEvent e) {
                SwingUtilities.invokeLater(new Runnable() {
                    @Override
                    public void run() {
                        System.out.println("El Sensor de Huella Digital esta Activado o Conectado");
                    }
                });
            }
            
            @Override
            public void readerDisconnected(final DPFPReaderStatusEvent e) {
                SwingUtilities.invokeLater(new Runnable() {
                    @Override
                    public void run() {
                        System.out.println("El Sensor de Huella Digital esta Desactivado o no Conecatado");
                    }
                });
            }
        });
        
        this.lector.addSensorListener(new DPFPSensorAdapter() {
            @Override
            public void fingerTouched(final DPFPSensorEvent e) {
                SwingUtilities.invokeLater(new Runnable() {
                    @Override
                    public void run() {
                        System.out.println("El dedo ha sido colocado sobre el Lector de Huella");
                    }
                });
            }
            
            @Override
            public void fingerGone(final DPFPSensorEvent e) {
                SwingUtilities.invokeLater(new Runnable() {
                    @Override
                    public void run() {
                        System.out.println("El dedo ha sido quitado del Lector de Huella");
                    }
                });
            }
        });
        
        this.lector.addErrorListener(new DPFPErrorAdapter(){
            public void errorReader(final DPFPErrorEvent e){
                SwingUtilities.invokeLater(new Runnable() {
                    @Override
                    public void run() {
                        System.out.println("Error: " + e.getError());
                    }
                });
            }
        });
    }
    
    public void procesarCaptura(DPFPSample sample) {
        this.featuresInscripcion = extraerCaracteristicas(sample, DPFPDataPurpose.DATA_PURPOSE_ENROLLMENT);
        this.featuresVerificacion = extraerCaracteristicas(sample, DPFPDataPurpose.DATA_PURPOSE_VERIFICATION);
        
        if (this.featuresInscripcion != null) {
            try {
                this.reclutador.addFeatures(this.featuresInscripcion);
                this.image = crearImagenHuella(sample);
                System.out.println("Las Caracteristicas de la Huella han sido creadas");
                //this.reclutador.clear();
            } catch (DPFPImageQualityException ex) {
                System.out.println("Error: " + ex.getMessage());
            } finally {
                estadoHuellas();
                
                // Comprueba si la plantilla se ha creado.
                switch(this.reclutador.getTemplateStatus()) {
                    case TEMPLATE_STATUS_READY: //informe de éxito y detiene la captura de huellas
                        //stop();
                        setTemplate(this.reclutador.getTemplate());
                        System.out.println("La Plantilla de la Huella ha Sido Creada, ya puede Verificarla o Identificarla");
                        break;
                        
                    case TEMPLATE_STATUS_FAILED: //informe de fallas y reiniciar la captura de huellas
                        this.reclutador.clear();
                        //stop();
                        estadoHuellas();
                        setTemplate(null);
                        System.out.println("La Plantilla de la Huella no pudo ser creada, Repita el Proceso");
                        lblMensaje.setText("Huella no capturada");
                        //start();
                        break;
                }
            }
        }
    }
    
    public DPFPFeatureSet extraerCaracteristicas(DPFPSample sample, DPFPDataPurpose purpose) {
        DPFPFeatureExtraction extractor = DPFPGlobal.getFeatureExtractionFactory().createFeatureExtraction();
        
        try {
            return extractor.createFeatureSet(sample, purpose);
        } catch (DPFPImageQualityException e) {
            return null;
        }
    }
    
    public Image crearImagenHuella(DPFPSample sample) {
        return DPFPGlobal.getSampleConversionFactory().createImage(sample);
    }
    
    public void estadoHuellas() {
        System.out.println("Muestra de Huellas Necesarias para Guardar Template " + this.reclutador.getFeaturesNeeded());
        this.lblMensaje.setText("Tomas Faltantes: " + this.reclutador.getFeaturesNeeded());
    }
    
    public void starts() {
        this.lector.startCapture();
        System.out.println("Utilizando el Lector de Huella Dactilar ");
    }
    
    public void stops() {
        this.lector.stopCapture();
        System.out.println("No se está usando el Lector de Huella Dactilar ");
    }
    
    public DPFPTemplate getTemplate() {
        return this.template;
    }
    
    public void setTemplate(DPFPTemplate template) {
        DPFPTemplate old = this.template;
        this.template = template;
        firePropertyChange(HuellaApplet.TEMPLATE_PROPERTY, old, template);
    }
    
    private class ListenerAgregar implements ActionListener {
        @Override
        public void actionPerformed(ActionEvent e) {
            enviarHuella(true);
        }
    }
    
    private class ListenerComparar implements ActionListener {
        @Override
        public void actionPerformed(ActionEvent e) {
            compararHuella();
        }
    }
    
    private class ListenerReiniciar implements ActionListener {
        @Override
        public void actionPerformed(ActionEvent e) {
            reclutador.clear();
            lblMensaje.setText("Tomas Faltantes: 4");
        }
    }
    
    private void enviarHuella(boolean indMensaje) {
        try {
            if (this.reclutador.getFeaturesNeeded() == 0) {
                String fileName = "arch_huella.oct";
                
                //Envío del archivo
                HttpClient httpClient = new DefaultHttpClient();
                
                //Se obtiene la URL del archivo que cargará la imagen
                String strURL = this.getCodeBase().toString();
                strURL = strURL.substring(0, strURL.lastIndexOf("/") + 1) + "manejo_huella.php";
                //String strURL = "http://sirio/hceo/manejo_huella/manejo_huella.php";
                
                //Url donde se enviara el request
                HttpPost httpPost = new HttpPost(strURL);
                
                MultipartEntity mEntity = new MultipartEntity();
                
                //Se colocan los parametros del formulario
                mEntity.addPart("fil_print", new ByteArrayBody(this.template.serialize(), fileName));
                //mEntity.addPart("nombre", new StringBody(fileName));
                mEntity.addPart("id_usuario", new StringBody(this.idUsuario + ""));
                
                httpPost.setEntity(mEntity);
                HttpResponse response = httpClient.execute(httpPost);
                HttpEntity resEntity = response.getEntity();
                
                //Guardando la respuesta del servidor
                InputStream is = resEntity.getContent();
                StringBuilder buff = new StringBuilder();
                int read;
                while ((read = is.read())!= -1) {
                    buff.append((char)read);
                }
                
                if (indMensaje) {
                    lblMensaje.setText("Huella enviada");
                }
            } else {
                lblMensaje.setText("Huella no enviada");
            }
        } catch (IOException ex) {
            System.err.println(ex.getMessage());
        }
    }
    
    private void compararHuella() {
        if (this.reclutador.getFeaturesNeeded() == 0) {
            //Se envía la huella
            enviarHuella(false);
            
            //Se crea una plantilla con la huella recibida
            DPFPTemplate referenceTemplate = DPFPGlobal.getTemplateFactory().createTemplate(this.huellaOri);
            
            //Envia la plantilla creada al objeto contendor de Template del componente de huella digital
            this.setTemplate(referenceTemplate);
            
            //Compara las caracteriticas de la huella capturda con la plantilla recibida
            DPFPVerificationResult result = this.verificador.verify(this.featuresVerificacion, getTemplate());
            
            //compara las plantilas (actual vs bd)
            if (result.isVerified()) {
                lblMensaje.setText("la huella coincide");
            } else {
                lblMensaje.setText("la huella no coincide");
            }
        } else {
            lblMensaje.setText("Huella no verificada");
        }
    }
}
