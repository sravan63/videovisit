package org.kp.tpmg.ttg.webcare.videovisits.member.web.parser;

import java.util.List;

public class faqitem {
	
	private String header;
	private List<hyperlink> faqHyperlink;
	private String id;
	
	public String getHeader()
	{
		return header;
	}

	public void setHeader(String header)
	{
		this.header = header;
	}
	
	public List<hyperlink> getFaqHyperLinks()
	{
		return faqHyperlink;
	}
	
	public void setFaqHyperLinks(List<hyperlink> faqhyperlink)
	{
		this.faqHyperlink = faqhyperlink;
	}
	
	public void setId(String id)
	{
		this.id = id;
	}
	
	public String getId()
	{
		return id;
	}
}
