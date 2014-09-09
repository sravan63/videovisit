package org.kp.tpmg.common.security;

import java.io.FileNotFoundException;
import javax.xml.stream.XMLStreamException;

import org.apache.axiom.om.impl.builder.StAXOMBuilder;
import org.apache.axis2.context.ConfigurationContext;
import org.apache.axis2.context.ConfigurationContextFactory;
import org.apache.log4j.Logger;
import org.apache.neethi.Policy;
import org.apache.neethi.PolicyEngine;

public class ServiceSecurityLoader {
	
	public static Logger logger = Logger.getLogger(ServiceSecurityLoader.class);	
	
	private static ConfigurationContext axisConfig = null;
	
	private static Policy policy = null;
    
    public static Policy getPolicy(String xmlPath){
    	logger.info("Entered ServiceSecurityLoader.getPolicy -> Policy: " + policy + "  - Policy file path: " + xmlPath);
        if(policy == null){
        	synchronized (ServiceSecurityLoader.class) {
        		if(policy == null){
        			try {
        				logger.info("ServiceSecurityLoader.getPolicy -> Policy is null so loading policy.");
        				policy = loadPolicy(xmlPath);
        			} catch (FileNotFoundException e) {
        				// TODO Auto-generated catch block
        				logger.error("ServiceSecurityLoader -> Error while loading policy: " + e.getMessage(),e);
        				throw new RuntimeException("Error while loading policy in ServiceSecurityLoader.loadPolicy" + e.getMessage(),e);
        			} catch (XMLStreamException e) {
        				// TODO Auto-generated catch block
        				logger.error("ServiceSecurityLoader -> Error while loading policy: " + e.getMessage(),e);
        				throw new RuntimeException("Error while loading policy in ServiceSecurityLoader.loadPolicy" + e.getMessage(),e);
        			} catch (Exception ex) {
        				logger.error("ServiceSecurityLoader -> Error while loading policy: " + ex.getMessage(),ex);
        				throw new RuntimeException("Error while loading policy in ServiceSecurityLoader.loadPolicy" + ex.getMessage(),ex);
        			}
        				
        		}
        	}
        }
        logger.info("Exiting ServiceSecurityLoader.getPolicy -> returning Policy: " + policy);
        return policy;       
    }
    
    public static ConfigurationContext getConfigContext(String modulePath){
    	logger.info("Entered ServiceSecurityLoader.getConfigContext -> axisConfig: " + axisConfig + "  - module path: " + modulePath);
        if(axisConfig == null){
        	synchronized (ServiceSecurityLoader.class) {
        		if(axisConfig == null){
        			try {
        				logger.info("ServiceSecurityLoader.getConfigContext -> axisConfig is null so creating new.");
        				axisConfig = createConfigContext(modulePath);
        			} catch (FileNotFoundException e) {
        				// TODO Auto-generated catch block
        				logger.error("ServiceSecurityLoader.getConfigContext -> Error while creating axisConfig: " + e.getMessage(),e);
        				throw new RuntimeException("Error while creating axisConfig in ServiceSecurityLoader.createConfigContext" + e.getMessage(),e);
        			} catch (Exception ex) {
        				logger.error("ServiceSecurityLoader.getConfigContext -> Error while creating axisConfig: " + ex.getMessage(),ex);
        				throw new RuntimeException("Error while creating axisConfig in ServiceSecurityLoader.createConfigContext" + ex.getMessage(),ex);
        			}
        				
        		}
        	}
        }
        logger.info("Exiting ServiceSecurityLoader.getConfigContext -> returning axisConfig: " + axisConfig);
        return axisConfig;       
    }
    
    private static Policy loadPolicy(String xmlPath)
            throws XMLStreamException, FileNotFoundException { 

        StAXOMBuilder builder = new StAXOMBuilder(xmlPath);
        return PolicyEngine.getPolicy(builder.getDocumentElement());

    }
    
    private static ConfigurationContext createConfigContext(String modulePath)
            throws Exception { 
    	
			return ConfigurationContextFactory.createConfigurationContextFromFileSystem(modulePath);		  

    }    
    
}
