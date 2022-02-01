package org.kp.tpmg.ttg.webcare.videovisits.member.web.parser;

import java.io.Serializable;

public class videolink implements Serializable {

	private static final long serialVersionUID = 2073024699786339386L;
	
	private String title;
	private String header;
	private String abstractText;
	private icon videoIcon;
	private String id;

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getHeader() {
		return header;
	}

	public void setHeader(String header) {
		this.header = header;
	}

	public void setAbstractText(String abstractText) {
		this.abstractText = abstractText;
	}

	public String getAbstractText() {
		return abstractText;
	}

	public icon getVideoIcon() {
		return videoIcon;
	}

	public void setVideoIcon(icon videoIcon) {
		this.videoIcon = videoIcon;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getId() {
		return id;
	}

}
