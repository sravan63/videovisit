package org.kp.tpmg.ttg.webcare.videovisits.member.web.parser;

import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.ResourceBundle;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.mdo.xml.faqlist.FAQItemDocument.FAQItem;
import org.kp.tpmg.ttg.mdo.xml.faqlist.FAQListDocument;
import org.kp.tpmg.ttg.mdo.xml.faqlist.FAQListDocument.FAQList;
import org.kp.tpmg.ttg.mdo.xml.faqlist.HyperlinkDocument.Hyperlink;



public class FaqParser {

	private static final Logger log = Logger.getLogger(FaqParser.class);
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		faq f = parse();
		System.out.println(" f.list title = " + f.getFaqListTitle());
		System.out.println(" f.item count = " + f.getFaqItems().size());
	}

	public static faq parse()
	{
		
		try
		{
			ResourceBundle rbInfo = ResourceBundle.getBundle("configuration");
			String faqUrl = rbInfo.getString("MDO_FAQ_URL");
			URL u = new URL(faqUrl);
			
			
			faq f = new faq();
			FAQList faqList = FAQListDocument.Factory.parse(u).getFAQList();
			
			String faqListTitle = faqList.getFAQListTitle();
			
			f.setFaqListTitle(faqListTitle);
			if ( faqList.getFAQItems() != null && faqList.getFAQItems().getFAQItemArray() != null)
			{
				List<faqitem> lstFaqItem = new ArrayList<faqitem>();
				
				for (FAQItem faqItem : faqList.getFAQItems().getFAQItemArray())
				{
					faqitem item = new faqitem();
				
					String faqItemHeader = faqItem.getFAQItemHeader();
					String id = faqItem.getID();
					
					item.setHeader(faqItemHeader);
					item.setId(id);
					if ( faqItem.getHyperlinkArray() != null)
					{
						List<hyperlink> listLinks = new ArrayList<hyperlink>();
						
						for ( Hyperlink hyperlink : faqItem.getHyperlinkArray())
						{
							hyperlink link = new hyperlink();
							String abstractText = hyperlink.getAbstract();
							String title = hyperlink.getTitle();
							String url = hyperlink.getUrl();
							link.setAbstractText(abstractText);
							link.setTitle(title);
							link.setUrl(url);
							listLinks.add(link);
						}
						item.setFaqHyperLinks(listLinks);
					}
					lstFaqItem.add(item);
				}
				f.setFaqItems(lstFaqItem);
			}
			return f;
		}
		catch(Exception e)
		{
			log.error(e);
			System.out.println("e message = " + e.getMessage());
			return null;
		}
		
	}
}
