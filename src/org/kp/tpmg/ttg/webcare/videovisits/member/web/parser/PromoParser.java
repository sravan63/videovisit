package org.kp.tpmg.ttg.webcare.videovisits.member.web.parser;

import java.io.File;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.ResourceBundle;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.mdo.xml.faqlist.FAQItemDocument.FAQItem;
import org.kp.tpmg.ttg.mdo.xml.faqlist.FAQListDocument;
import org.kp.tpmg.ttg.mdo.xml.faqlist.FAQListDocument.FAQList;
import org.kp.tpmg.ttg.mdo.xml.faqlist.HyperlinkDocument.Hyperlink;
import org.kp.tpmg.ttg.mdo.xml.promo.PromoDocument.Promo;
import org.kp.tpmg.ttg.mdo.xml.promo.PromosDocument;
import org.kp.tpmg.ttg.mdo.xml.promo.PromosDocument.Promos;



public class PromoParser {

	private static final Logger log = Logger.getLogger(PromoParser.class);
	/**
	 * @param args
	 */
	

	public static List<promo> parse()
	{
		
		try
		{
			ResourceBundle rbInfo = ResourceBundle.getBundle("configuration");
			String promoUrl = rbInfo.getString("MDO_PROMO_URL");
			String promoPath = rbInfo.getString("MDO_PROMO_PATH");
			File promoFile = new File(promoPath);
			Promo[] promos;
			if ( promoFile.exists())
			{
				log.info("File exists in path = " + promoPath);
				promos = PromosDocument.Factory.parse(promoFile).getPromos().getPromoArray();
			}
			else
			{
				log.info("reading from url = " + promoUrl);
				URL u = new URL(promoUrl);
				promos = PromosDocument.Factory.parse(u).getPromos().getPromoArray();
			}
			List<promo> listPromos = new ArrayList<promo>();
			for ( Promo p : promos)
			{
				promo pr = new promo();
				
				String title = p.getTitle();
				String header = p.getHeader();
				String abstractText = p.getAbstract();
				String id = p.getID();
				int sequence = p.getSequence().intValue();
				pr.setAbstractText(abstractText);
				pr.setHeader(header);
				pr.setTitle(title);
				pr.setId(id);
				pr.setSequence(sequence);
				if ( p.getHyperlink() != null)
				{
					hyperlink link = new hyperlink();
					
					String linkTitle = p.getHyperlink().getTitle();
					String url = p.getHyperlink().getUrl();
					
					link.setTitle(linkTitle);
					link.setUrl(url);
					pr.setPromoHyperLink(link);
				}
				listPromos.add(pr);
			}
			Collections.sort(listPromos, new promo.seq());
			return listPromos;
			
			
		}
		catch(Exception e)
		{
			log.error(e);
			
			return null;
		}
		
	}
}
