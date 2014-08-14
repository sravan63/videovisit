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
import org.kp.tpmg.ttg.mdo.xml.iconPromo.IconPromoDocument.IconPromo;
import org.kp.tpmg.ttg.mdo.xml.iconPromo.IconPromosDocument;
import org.kp.tpmg.ttg.mdo.xml.promo.PromoDocument.Promo;
import org.kp.tpmg.ttg.mdo.xml.promo.PromosDocument;
import org.kp.tpmg.ttg.mdo.xml.promo.PromosDocument.Promos;
import org.kp.tpmg.ttg.mdo.xml.videolink.VideoLinkDocument;
import org.kp.tpmg.ttg.mdo.xml.videolink.VideoLinkDocument.VideoLink;



public class VideoLinkParser {

	private static final Logger log = Logger.getLogger(VideoLinkParser.class);
	

	public static videolink parse()
	{
		
		try
		{
			ResourceBundle rbInfo = ResourceBundle.getBundle("configuration");
			String videoLinkPath = rbInfo.getString("MDO_VIDEO_LINK_PATH");
			File videoLinkFile = new File(videoLinkPath);
			VideoLink videoLink;
			log.info("File exists in path = " + videoLinkPath);
			videoLink = VideoLinkDocument.Factory.parse(videoLinkFile).getVideoLink();
						
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
			
			return null;
		}
		
	}
}
