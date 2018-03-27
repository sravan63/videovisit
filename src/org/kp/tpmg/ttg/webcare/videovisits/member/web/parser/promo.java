package org.kp.tpmg.ttg.webcare.videovisits.member.web.parser;

import java.io.Serializable;
import java.util.Comparator;

public class promo implements Serializable {

	private static final long serialVersionUID = 6813326739015946490L;
	
	private String title;
	private String header;
	private String abstractText;
	private hyperlink promoHyperLink;
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

	public hyperlink getPromoHyperLink() {
		return promoHyperLink;
	}

	public void setPromoHyperLink(hyperlink promoHyperLink) {
		this.promoHyperLink = promoHyperLink;
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
	public static class seq implements Comparator<promo>, Serializable {

		private static final long serialVersionUID = 406946342195320250L;

		@Override
		public int compare(promo arg0, promo arg1) {
			return arg0.sequence - arg1.sequence;
		}
	}

}
