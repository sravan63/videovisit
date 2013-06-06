package org.kp.tpmg.ttg.webcare.videovisits.member.web.parser;



public class iconpromo {

	private String title;
	private String header;
	private String abstractText;
	private hyperlink iconpromoHyperLink;
	private icon promoIcon;
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
	
	public hyperlink getIconPromoHyperLink()
	{
		return iconpromoHyperLink;
	}
	
	public void setIconPromoHyperLink(hyperlink iconpromoHyperLink)
	{
		this.iconpromoHyperLink = iconpromoHyperLink;
	}
	
	public icon getPromoIcon()
	{
		return promoIcon;
	}
	
	public void setPromoIcon(icon promoIcon)
	{
		this.promoIcon = promoIcon;
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
