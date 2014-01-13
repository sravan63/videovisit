package org.kp.tpmg.ttg.webcare.videovisits.member.web.parser;

import java.io.File;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.ResourceBundle;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.mdo.xml.faqlist.FAQItemDocument.FAQItem;
import org.kp.tpmg.ttg.mdo.xml.faqlist.FAQListDocument;
import org.kp.tpmg.ttg.mdo.xml.faqlist.FAQListDocument.FAQList;
import org.kp.tpmg.ttg.mdo.xml.faqlist.HyperlinkDocument.Hyperlink;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.faq;



public class FaqParser {

	private static final Logger log = Logger.getLogger(FaqParser.class);
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		faq f = parse();
		log.info(" f.list title = " + f.getFaqListTitle());
		log.info(" f.item count = " + f.getFaqItems().size());
	}

	public static faq parse()
	{
		
		try
		{
			ResourceBundle rbInfo = ResourceBundle.getBundle("configuration");
			String faqUrl = rbInfo.getString("MDO_FAQ_URL");
			String faqPath = rbInfo.getString("MDO_FAQ_PATH");
			File faqFile = new File(faqPath);
			FAQList faqList;
			if ( faqFile.exists())
			{
				log.info("File exists in path = " + faqPath);
				faqList = FAQListDocument.Factory.parse(faqFile).getFAQList();
			}
			else
			{
				log.info("reading from url = " + faqUrl);
				URL u = new URL(faqUrl);
				faqList = FAQListDocument.Factory.parse(u).getFAQList();
			}
			
			faq f = new faq();
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
					int sequence  = faqItem.getSequence().intValue();
					
					if (faqItemHeader == null) {
						log.info("FaqParser - faqItemHeader:null");
					} else {
						log.info("FaqParser - faqItemHeader:" + faqItemHeader);
					}

					if (id == null) {
						log.info("FaqParser - id:null");
					} else {
						log.info("FaqParser - id:" + id);
					}

					log.info("FaqParser - Sequence:" + sequence);
					
					String orientation = faqItem.getOrientation();
					item.setHeader(faqItemHeader);
					item.setId(id);
					item.setOrientation(orientation);
					item.setSequence(sequence);
					if ( faqItem.getHyperlinkArray() != null)
					{
						List<hyperlink> listLinks = new ArrayList<hyperlink>();
						
						for ( Hyperlink hyperlink : faqItem.getHyperlinkArray())
						{
							hyperlink link = new hyperlink();
							String abstractText = hyperlink.getAbstract();
							String title = hyperlink.getTitle();
							String url = hyperlink.getUrl();

							if (title == null) {
								log.info("FaqParser Hyperlink - title:null");
							} else {
								log.info("FaqParser Hyperlink - title:" + title);
								
							}
							
							if (url == null) {
								log.info("FaqParser Hyperlink - url:null");
							} else {
								log.info("FaqParser Hyperlink - url:" + url);
								
							}
							

							String section = hyperlink.getSection();
							link.setAbstractText(abstractText);
							link.setTitle(title);
							link.setUrl(url);
							link.setSection(section);
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
			
			return null;
		}
		
	}
}
