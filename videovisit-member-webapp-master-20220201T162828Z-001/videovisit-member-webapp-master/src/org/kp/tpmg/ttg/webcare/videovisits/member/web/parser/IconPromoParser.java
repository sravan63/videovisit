package org.kp.tpmg.ttg.webcare.videovisits.member.web.parser;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.mdo.xml.iconPromo.IconPromoDocument.IconPromo;
import org.kp.tpmg.ttg.mdo.xml.iconPromo.IconPromosDocument;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.AppProperties;

public class IconPromoParser {

	private static final Logger logger = Logger.getLogger(IconPromoParser.class);

	/**
	 * @param args
	 */

	public static List<iconpromo> parse() {

		try {
			String iconPromoPath = AppProperties.getExtPropertiesValueByKey("MDO_ICON_PROMO_PATH");
			File iconPromoFile = new File(iconPromoPath);
			IconPromo[] promos;
			logger.info("File exists in path = " + iconPromoPath);
			promos = IconPromosDocument.Factory.parse(iconPromoFile).getIconPromos().getIconPromoArray();

			List<iconpromo> listPromos = new ArrayList<iconpromo>();
			for (IconPromo p : promos) {
				iconpromo pr = new iconpromo();

				String title = p.getTitle();
				logger.info("icon promo title = " + title);
				String header = p.getHeader();
				String abstractText = p.getAbstract();
				String id = p.getID();
				int sequence = p.getSequence().intValue();
				pr.setAbstractText(abstractText);
				pr.setHeader(header);
				pr.setTitle(title);
				pr.setId(id);
				pr.setSequence(sequence);
				if (p.getHyperlink() != null) {
					hyperlink link = new hyperlink();

					String linkTitle = p.getHyperlink().getTitle();
					String url = p.getHyperlink().getUrl();

					link.setTitle(linkTitle);
					link.setUrl(url);
					pr.setIconPromoHyperLink(link);
				}

				if (p.getIcon() != null) {
					icon i = new icon();
					i.setTitle(p.getIcon().getTitle());
					i.setPath(p.getIcon().getPath());
					pr.setPromoIcon(i);
				}
				listPromos.add(pr);
			}
			Collections.sort(listPromos, new iconpromo.seq());
			return listPromos;

		} catch (Exception e) {
			logger.error("Error while parsing icon promo", e);

			return null;
		}

	}
}
