package org.kp.tpmg.ttg.webcare.videovisits.member.web.parser;


import java.util.List;

public class promo {

	private String title;
	private String header;
	private String abstractText;
	private hyperlink promoHyperLink;
	private String id;

	public String getTitle()
	{
		return title;
	}

	public void setTitle(String title)
	{
		this.title = title;
	}
	
	public String getHeader()
	{
		return header;
	}

	public void setHeader(String header)
	{
		this.header = header;
	}
	
	public void setAbstractText(String abstractText)
	{
		this.abstractText = abstractText;
	}
	
	public String getAbstractText()
	{
		return abstractText;
	}
	
	public hyperlink getPromoHyperLink()
	{
		return promoHyperLink;
	}
	
	public void setPromoHyperLink(hyperlink promoHyperLink)
	{
		this.promoHyperLink = promoHyperLink;
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
