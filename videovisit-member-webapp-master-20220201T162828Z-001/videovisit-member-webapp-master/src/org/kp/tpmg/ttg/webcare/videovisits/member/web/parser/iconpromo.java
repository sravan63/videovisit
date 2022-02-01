package org.kp.tpmg.ttg.webcare.videovisits.member.web.parser;

import java.io.Serializable;
import java.util.Comparator;

public class iconpromo implements Serializable {

	private static final long serialVersionUID = 1638725067008058810L;
	
	private String title;
	private String header;
	private String abstractText;
	private hyperlink iconpromoHyperLink;
	private icon promoIcon;
	private String id;
	private int sequence;

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

	public hyperlink getIconPromoHyperLink() {
		return iconpromoHyperLink;
	}

	public void setIconPromoHyperLink(hyperlink iconpromoHyperLink) {
		this.iconpromoHyperLink = iconpromoHyperLink;
	}

	public icon getPromoIcon() {
		return promoIcon;
	}

	public void setPromoIcon(icon promoIcon) {
		this.promoIcon = promoIcon;
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

	// Comparator
	public static class seq implements Comparator<iconpromo>, Serializable {

		private static final long serialVersionUID = -626062665037209339L;

		@Override
		public int compare(iconpromo arg0, iconpromo arg1) {
			return arg0.sequence - arg1.sequence;
		}
	}

}
