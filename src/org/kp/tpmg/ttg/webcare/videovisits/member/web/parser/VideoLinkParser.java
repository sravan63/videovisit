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
import org.kp.tpmg.ttg.mdo.xml.videolink.VideoLinkDocument;
import org.kp.tpmg.ttg.mdo.xml.videolink.VideoLinkDocument.VideoLink;



public class VideoLinkParser {

	private static final Logger log = Logger.getLogger(VideoLinkParser.class);
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
//		faq f = parse();
//		System.out.println(" f.list title = " + f.getFaqListTitle());
//		System.out.println(" f.item count = " + f.getFaqItems().size());
	}

	public static videolink parse()
	{
		
		try
		{
			ResourceBundle rbInfo = ResourceBundle.getBundle("configuration");
			String faqUrl = rbInfo.getString("MDO_VIDEO_LINK_URL");
			URL u = new URL(faqUrl);
					
			VideoLink videoLink = VideoLinkDocument.Factory.parse(u).getVideoLink();
			videolink v = new videolink();
			if ( videoLink != null)
			{
				String abstractText = videoLink.getAbstract();
				String title = videoLink.getTitle();
				String id = videoLink.getID();
				v.setId(id);
				v.setAbstractText(abstractText);
				v.setTitle(title);
				
				if ( videoLink.getImage() != null)
				{
					String path = videoLink.getImage().getPath();
					String iconTitle = videoLink.getImage().getImageTitle();
					icon vi = new icon();
					vi.setPath(path);
					vi.setTitle(iconTitle);
					v.setVideoIcon(vi);
				}
			}
			
			
			return v;
			
			
		}
		catch(Exception e)
		{
			log.error(e);
			System.out.println("e message = " + e.getMessage());
			return null;
		}
		
	}
}
