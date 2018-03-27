package org.kp.tpmg.ttg.webcare.videovisits.member.web.parser;

import java.io.Serializable;
import java.util.Comparator;
import java.util.List;

public class faqitem implements Serializable {

	private static final long serialVersionUID = -586037815289272340L;
	
	private String header;
	private List<hyperlink> faqHyperlink;
	private String id;
	private int sequence;
	private String orientation;

	public String getHeader() {
		return header;
	}

	public void setHeader(String header) {
		this.header = header;
	}

	public List<hyperlink> getFaqHyperLinks() {
		return faqHyperlink;
	}

	public void setFaqHyperLinks(List<hyperlink> faqhyperlink) {
		this.faqHyperlink = faqhyperlink;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getId() {
		return id;
	}

	public void setSequence(int sequence) {
		this.sequence = sequence;
	}

	public int getSequence() {
		return sequence;
	}

	public void setOrientation(String orientation) {
		this.orientation = orientation;
	}

	public String getOrientation() {
		return orientation;
	}

	// Comparator
	public static class seq implements Comparator<faqitem>, Serializable {

		private static final long serialVersionUID = -414498722245416076L;

		@Override
		public int compare(faqitem arg0, faqitem arg1) {
			return arg0.sequence - arg1.sequence;
		}
	}
}
