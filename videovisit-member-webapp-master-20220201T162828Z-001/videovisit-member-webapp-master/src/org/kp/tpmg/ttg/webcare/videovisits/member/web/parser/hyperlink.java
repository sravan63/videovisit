package org.kp.tpmg.ttg.webcare.videovisits.member.web.parser;

import java.io.Serializable;

public class hyperlink implements Serializable {

	private static final long serialVersionUID = 6808069695277681448L;
	
	private String title;
	private String url;
	private String abstractText;
	private String section;

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getAbstractText() {
		return abstractText;
	}

	public void setAbstractText(String abstractText) {
		this.abstractText = abstractText;
	}

	public String getSection() {
		return section;
	}

	public void setSection(String section) {
		this.section = section;
	}
}
