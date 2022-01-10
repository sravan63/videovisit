package org.kp.tpmg.ttg.webcare.videovisits.member.web.properties;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.kp.tpmg.ttg.common.property.ApplicationProperty;
import org.kp.tpmg.ttg.common.property.ApplicationPropertyException;
import org.kp.tpmg.ttg.common.property.IApplicationProperties;

public class AppProperties {
	
	private AppProperties() {
	}
	
	private static AppProperties instance;
	private static IApplicationProperties properties = null;
	private static final Logger logger = LoggerFactory.getLogger(AppProperties.class);
	public static final String PROPERTY_FILE_PATH = "/usr/local/middleware/tcservervv/conf/appconf/vvm/videovisit.properties";
	
	
	public static AppProperties getInstance() {
		synchronized(AppProperties.class) {
			if (instance == null) {
				instance = new AppProperties();
			}
		}
		return instance;
	}
	
	public static String getExtPropertiesValueByKey(String strKey) {
		String keyValue = "";
		try {
			keyValue = getInstance().getApplicationProperty().getProperty(strKey);
		} catch (Exception ex) {
			logger.error("Error in getting external property value by key: " + strKey, ex);
		}
		return keyValue;

	}

	public IApplicationProperties getApplicationProperty() {
		return AppPropertiesInitializer.getApplicationProperties();
	}

	public static class AppPropertiesInitializer {

		public static IApplicationProperties getApplicationProperties() {
			if (properties == null) {
				try {
					final List<String> propertyFiles = new ArrayList<String>();
					propertyFiles.add(PROPERTY_FILE_PATH);
					properties = ApplicationProperty.getFilePropertyInstance(propertyFiles);
				} catch (ApplicationPropertyException ex) {
					logger.error("Error loading property files" + ex.getMessage(), ex);
				}
			}
			return properties;
		}
	}

}
