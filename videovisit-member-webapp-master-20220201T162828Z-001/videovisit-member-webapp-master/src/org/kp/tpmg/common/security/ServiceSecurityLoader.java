package org.kp.tpmg.common.security;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import java.io.FileNotFoundException;

import javax.xml.stream.XMLStreamException;

import org.apache.axiom.om.impl.builder.StAXOMBuilder;
import org.apache.axis2.context.ConfigurationContext;
import org.apache.axis2.context.ConfigurationContextFactory;
import org.apache.log4j.Logger;
import org.apache.neethi.Policy;
import org.apache.neethi.PolicyEngine;

public class ServiceSecurityLoader {
	
	private ServiceSecurityLoader() {
	}

	public static final Logger logger = Logger.getLogger(ServiceSecurityLoader.class);

	private static ConfigurationContext axisConfig = null;

	private static Policy policy = null;

	public static Policy getPolicy(String xmlPath) {
		logger.info(LOG_ENTERED);
		logger.debug("Policy: " + policy + "  - Policy file path: " + xmlPath);
		if (policy == null) {
			synchronized (ServiceSecurityLoader.class) {
				if (policy == null) {
					try {
						logger.info("Policy is null so loading policy.");
						policy = loadPolicy(xmlPath);
					} catch (FileNotFoundException e) {
						logger.error("Error while loading policy: " + e.getMessage(), e);
						throw new RuntimeException("Error while loading policy" + e.getMessage(), e);
					} catch (XMLStreamException e) {
						logger.error("Error while loading policy: " + e.getMessage(), e);
						throw new RuntimeException("Error while loading policy" + e.getMessage(), e);
					} catch (Exception ex) {
						logger.error("Error while loading policy: " + ex.getMessage(), ex);
						throw new RuntimeException("Error while loading policy" + ex.getMessage(), ex);
					}

				}
			}
		}
		logger.info(LOG_EXITING);
		return policy;
	}

	public static ConfigurationContext getConfigContext(String modulePath) {
		logger.info(LOG_ENTERED);
		logger.debug("axisConfig: " + axisConfig + "  - module path: " + modulePath);
		if (axisConfig == null) {
			synchronized (ServiceSecurityLoader.class) {
				if (axisConfig == null) {
					try {
						logger.info("axisConfig is null so creating new.");
						axisConfig = createConfigContext(modulePath);
					} catch (FileNotFoundException e) {
						logger.error("Error while creating axisConfig: " + e.getMessage(), e);
						throw new RuntimeException("Error while creating axisConfig" + e.getMessage(), e);
					} catch (Exception ex) {
						logger.error("Error while creating axisConfig: " + ex.getMessage(), ex);
						throw new RuntimeException("Error while creating axisConfig" + ex.getMessage(), ex);
					}

				}
			}
		}
		logger.info(LOG_EXITING);
		return axisConfig;
	}

	private static Policy loadPolicy(String xmlPath) throws XMLStreamException, FileNotFoundException {

		StAXOMBuilder builder = new StAXOMBuilder(xmlPath);
		return PolicyEngine.getPolicy(builder.getDocumentElement());

	}

	private static ConfigurationContext createConfigContext(String modulePath) throws Exception {

		return ConfigurationContextFactory.createConfigurationContextFromFileSystem(modulePath);

	}

}
