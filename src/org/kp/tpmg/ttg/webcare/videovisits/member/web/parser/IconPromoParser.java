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
import org.kp.tpmg.ttg.mdo.xml.iconPromo.IconPromoDocument.IconPromo;
import org.kp.tpmg.ttg.mdo.xml.iconPromo.IconPromosDocument;
import org.kp.tpmg.ttg.mdo.xml.promo.PromoDocument.Promo;
import org.kp.tpmg.ttg.mdo.xml.promo.PromosDocument;
import org.kp.tpmg.ttg.mdo.xml.promo.PromosDocument.Promos;



public class IconPromoParser {

	private static final Logger log = Logger.getLogger(IconPromoParser.class);
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
//		faq f = parse();
//		System.out.println(" f.list title = " + f.getFaqListTitle());
//		System.out.println(" f.item count = " + f.getFaqItems().size());
	}

	public static List<iconpromo> parse()
	{
		
		try
		{
			ResourceBundle rbInfo = ResourceBundle.getBundle("configuration");
			String faqUrl = rbInfo.getString("MDO_ICON_PROMO_URL");
			URL u = new URL(faqUrl);
					
			IconPromo[] promos = IconPromosDocument.Factory.parse(u).getIconPromos().getIconPromoArray();
			List<iconpromo> listPromos = new ArrayList<iconpromo>();
			for ( IconPromo p : promos)
			{
				iconpromo pr = new iconpromo();
				
				String title = p.getTitle();
				String header = p.getHeader();
				String abstractText = p.getAbstract();
				String id = p.getID();
				pr.setAbstractText(abstractText);
				pr.setHeader(header);
				pr.setTitle(title);
				pr.setId(id);
				if ( p.getHyperlink() != null)
				{
					hyperlink link = new hyperlink();
					
					String linkTitle = p.getHyperlink().getTitle();
					String url = p.getHyperlink().getUrl();
					
					link.setTitle(linkTitle);
					link.setUrl(url);
					pr.setIconPromoHyperLink(link);
				}
				
				if ( p.getIcon() != null)
				{
					icon i = new icon();
					i.setTitle(p.getIcon().getTitle());
					i.setPath(p.getIcon().getPath());
					pr.setPromoIcon(i);
				}
				listPromos.add(pr);
			}
			
			return listPromos;
			
			
		}
		catch(Exception e)
		{
			log.error(e);
			System.out.println("e message = " + e.getMessage());
			return null;
		}
		
	}
}
