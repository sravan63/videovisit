package org.kp.tpmg.ttg.webcare.videovisits.member.web.parser;

import java.io.Serializable;
import java.util.Collections;
import java.util.List;

public class faq implements Serializable {

	private static final long serialVersionUID = -1804379469280135652L;
	
	private String faqListTitle;
	private List<faqitem> faqItems;

	public String getFaqListTitle() {
		return faqListTitle;
	}

	public void setFaqListTitle(String faqListTitle) {
		this.faqListTitle = faqListTitle;
	}

	public List<faqitem> getFaqItems() {
		Collections.sort(faqItems, new faqitem.seq());
		return faqItems;
	}

	public void setFaqItems(List<faqitem> faqItems) {
		this.faqItems = faqItems;
	}

}
