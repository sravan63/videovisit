package org.kp.tpmg.ttg.webcare.videovisits.member.web.command;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.web.servlet.ModelAndView;

public class EnvironmentCommand implements InitializingBean {

	public static final Logger logger = Logger.getLogger(EnvironmentCommand.class);

	private File cssDependencyFile;
	private File jsDependencyFile;
	private JSONObject jsDependencies;
	private JSONObject cssDependencies;

	public JSONArray getCssDependencies(String currentNavigation, String currentSubNavigation) {
		return getPageDependencies(cssDependencies, currentNavigation, currentSubNavigation);
	}
	
	public JSONArray getJsDependencies(String currentNavigation, String currentSubNavigation) {
		
		return getPageDependencies(jsDependencies, currentNavigation, currentSubNavigation);
	}
	
	public void loadDependencies(ModelAndView modelAndView, String currentNavigation, String currentSubNavigation) {
		modelAndView.addObject("cssDependencies", getCssDependencies(currentNavigation, currentSubNavigation));
		modelAndView.addObject("jsDependencies", getJsDependencies(currentNavigation, currentSubNavigation));
		modelAndView.addObject("NAV", currentNavigation);
		modelAndView.addObject("SUBNAV", currentSubNavigation);
	}
	
	public void loadCoreDependencies(ModelAndView modelAndView) {
		loadDependencies(modelAndView, null, null);
	}

	/**
 	 * Spring lifecycle method which is called during startup to load the external dependency files.
 	 */
	public void afterPropertiesSet() throws Exception {
		cssDependencies = loadDependencyFile(getCssDependencyFile());
		jsDependencies = loadDependencyFile(getJsDependencyFile());
	}

 	protected JSONObject loadDependencyFile(File file) throws Exception { 		
 		
		BufferedReader in = new BufferedReader(new FileReader(file));
		String str;
		StringBuilder sb = new StringBuilder();
		while ((str = in.readLine()) != null) {
			sb.append(str);
		}
		in.close();
		return JSONObject.fromObject(sb.toString());
	}
 	
 	protected JSONArray getPageDependencies(JSONObject dependencies, String currentNavigation, String currentSubNavigation) {
 		
		JSONArray pageDependencies = new JSONArray();
		pageDependencies.addAll(dependencies.getJSONArray("library"));
		pageDependencies.addAll(dependencies.getJSONObject("plugins").getJSONArray("minimized"));
		pageDependencies.addAll(dependencies.getJSONObject("plugins").getJSONArray("unminimized"));
		pageDependencies.addAll(dependencies.getJSONArray("global"));
		if (dependencies.optJSONArray("environment") != null) {
			pageDependencies.addAll(dependencies.getJSONArray("environment"));
		}
		if (currentNavigation != null && currentNavigation.length() > 0) {
			pageDependencies.addAll(dependencies.getJSONObject("page").getJSONObject(currentNavigation).getJSONArray("global"));
			if (currentSubNavigation == null || currentSubNavigation.length() == 0) {
				
				if (dependencies.getJSONObject("page").getJSONObject(currentNavigation).getJSONObject("specific").optJSONArray(currentNavigation) != null) {
					pageDependencies.addAll(dependencies.getJSONObject("page").getJSONObject(currentNavigation).getJSONObject("specific").getJSONArray(currentNavigation));
				}
			} else {
				
				pageDependencies.addAll(dependencies.getJSONObject("page").getJSONObject(currentNavigation).getJSONObject("specific").getJSONArray(currentSubNavigation));
			}
		}
		
		return pageDependencies;
	}

	public File getCssDependencyFile() {
		return cssDependencyFile;
	}

	public void setCssDependencyFile(File cssDependencyFile) {
		this.cssDependencyFile = cssDependencyFile;
	}

	public File getJsDependencyFile() {
		return jsDependencyFile;
	}

	public void setJsDependencyFile(File jsDependencyFile) {
		this.jsDependencyFile = jsDependencyFile;
	}

}
