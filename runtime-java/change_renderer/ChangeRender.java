
import java.awt.Color;
import java.awt.EventQueue;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JOptionPane;

import java.awt.BorderLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;

import com.esri.runtime.ArcGISRuntime;
import com.esri.core.geometry.Envelope;
import com.esri.core.geometry.Geometry;
import com.esri.core.map.DrawingInfo;
import com.esri.core.map.DynamicLayerInfo;
import com.esri.core.map.DynamicLayerInfoCollection;
import com.esri.core.renderer.UniqueValueInfo;
import com.esri.core.renderer.UniqueValueRenderer;
import com.esri.core.symbol.SimpleFillSymbol;
import com.esri.map.ArcGISDynamicMapServiceLayer;
import com.esri.map.JMap;
import com.esri.map.Layer.LayerStatus;
import com.esri.map.LayerInitializeCompleteEvent;
import com.esri.map.LayerInitializeCompleteListener;
import com.esri.map.MapOptions;
import com.esri.map.MapOptions.MapType;

public class Viewshed implements ActionListener {

  private JFrame window;
  private JMap map;
  private JButton button;

  private ArcGISDynamicMapServiceLayer lyr;
  
  
  public Viewshed() {
    window = new JFrame();
    window.setSize(800, 600);
    window.setLocationRelativeTo(null); // center on screen
    window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    window.getContentPane().setLayout(new BorderLayout(0, 0));
    
    //add button
    button = new JButton("Change Renderer");
    button.addActionListener(this);
    
    //window.getContentPane().add(button);
    // dispose map just before application window is closed.
    window.addWindowListener(new WindowAdapter() {
      @Override
      public void windowClosing(WindowEvent windowEvent) {
        super.windowClosing(windowEvent);
        map.dispose();
      }
    });

    // Using MapOptions allows for a common online basemap to be chosen
    MapOptions mapOptions = new MapOptions(MapType.TOPO);
    map = new JMap(mapOptions);
    map.setExtent(new Envelope(-8833800,4541200,-8760400,4571400));
    // Add the JMap to the JFrame's content pane
    window.getContentPane().add(map);
    window.getContentPane().add(BorderLayout.SOUTH,button);
    
    //path to dynamic map service
	lyr = new ArcGISDynamicMapServiceLayer("http://csc-dchambers7d.esri.com/arcgis/rest/services/Cases/ViewShed_vector/MapServer");
		
	lyr.addLayerInitializeCompleteListener(new LayerInitializeCompleteListener(){

		@Override
		public void layerInitializeComplete(LayerInitializeCompleteEvent e) {
			if (e.getLayer().getStatus() == LayerStatus.INITIALIZED) {
			      // layer has initialized successfully
			      // take action such as adding the layer to a control
				System.out.println("success");
				//changeRender();
				
			    } else {
			      // layer has not successfully initialized
			      // take action such as reporting any error messages
			      System.out.println("Error: " + e.getLayer().getInitializationError());
			    }
			  }
			});
	map.getLayers().add(lyr);
	
	
    //addLayer();

  }
  public void changeRender(){
	  
	  System.out.println("in change render - removing layer");
	  map.getLayers().remove(lyr);
	  SimpleFillSymbol sym1 = new SimpleFillSymbol(Color.GREEN);
	  SimpleFillSymbol sym2 = new SimpleFillSymbol(Color.RED);
	  
	  //Create Renderer on 'value' field
	  UniqueValueRenderer renderer = new UniqueValueRenderer();
	  renderer.setAttributeName1("view");
	  
	  //Add symbol for each possible value
	  renderer.addValue(new UniqueValueInfo(new Object[]{"0"},sym1));
	  renderer.addValue(new UniqueValueInfo(new Object[]{"1"},sym2));
	  
	  //get layer info from the dynamic layer and set the drawing info
	  DrawingInfo drawingInfo = new DrawingInfo(renderer,50);
	  
	  DynamicLayerInfoCollection layerInfos = lyr.getDynamicLayerInfos();
	  int layerID = 0; //variable for layer ID
	  DynamicLayerInfo layerInfo = layerInfos.get(layerID);
	  layerInfo.setDrawingInfo(drawingInfo);

	  lyr.refresh();
	 
	  //add layer
	  map.getLayers().add(lyr);	  
	  
  }

  public static void main(String[] args) {
    EventQueue.invokeLater(new Runnable() {

      @Override
      public void run() {
        try {
          Viewshed application = new Viewshed();
          application.window.setVisible(true);
        } catch (Exception e) {
          e.printStackTrace();
        }
      }
    });
  }
@Override
public void actionPerformed(ActionEvent arg0) {
	System.out.println("button pressed");
	changeRender();
	
}
}
