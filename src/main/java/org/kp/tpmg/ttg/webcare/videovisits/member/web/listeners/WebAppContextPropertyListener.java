package org.kp.tpmg.ttg.webcare.videovisits.member.web.listeners;

import java.io.IOException;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.AppProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WebAppContextPropertyListener implements ServletContextListener {

	private static final Logger logger = LoggerFactory.getLogger(WebAppContextPropertyListener.class);

	@Override
	public void contextInitialized(ServletContextEvent event) {

	}

	@Override
	public void contextDestroyed(ServletContextEvent event) {
		try {
			AppProperties.getInstance().getApplicationProperty().close();
		} catch (IOException e) {
			logger.warn("Failed to close/kill Application Properties I/O or polling thread. This could cause memory leaks", e);
		}
	}
}
