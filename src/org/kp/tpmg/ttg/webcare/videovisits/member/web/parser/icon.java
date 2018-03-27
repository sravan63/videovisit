package org.kp.tpmg.ttg.webcare.videovisits.member.web.parser;

import java.io.Serializable;

public class icon implements Serializable {

	private static final long serialVersionUID = 7110664932997621564L;
	
	private String title;
	private String path;
	private String abstractText;

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getAbstractText() {
		return abstractText;
	}

	public void setAbstractText(String abstractText) {
		this.abstractText = abstractText;
	}
}
