package org.kp.tpmg.ttg.webcare.videovisits.member.web.parser;


import java.util.List;

public class faq {

	private String faqListTitle;
	private List<faqitem> faqItems;
	

	public String getFaqListTitle()
	{
		return faqListTitle;
	}

	public void setFaqListTitle(String faqListTitle)
	{
		this.faqListTitle = faqListTitle;
	}
	public List<faqitem> getFaqItems()
	{
		return faqItems;
	}
	
	public void setFaqItems(List<faqitem> faqItems)
	{
		this.faqItems = faqItems;
	}

}
