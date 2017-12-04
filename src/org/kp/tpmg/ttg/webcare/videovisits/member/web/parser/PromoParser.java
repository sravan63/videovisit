package org.kp.tpmg.ttg.webcare.videovisits.member.web.parser;

import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Properties;
import java.util.ResourceBundle;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.mdo.xml.promo.PromoDocument.Promo;
import org.kp.tpmg.ttg.mdo.xml.promo.PromosDocument;

public class PromoParser {

	private static final Logger logger = Logger.getLogger(PromoParser.class);

	/**
	 * @param args
	 */

	public static List<promo> parse() {

		try {
			ResourceBundle rbInfo = ResourceBundle.getBundle("configuration");
			logger.debug("configuration: resource bundle exists video visit external properties file location: "
					+ rbInfo.getString("VIDEOVISIT_EXT_PROPERTIES_FILE"));
			// Read external properties file
			File file = new File(rbInfo.getString("VIDEOVISIT_EXT_PROPERTIES_FILE"));
			FileInputStream fileInput = new FileInputStream(file);
			Properties appProp = new Properties();
			appProp.load(fileInput);
			String promoPath = appProp.getProperty("MDO_PROMO_PATH");
			File promoFile = new File(promoPath);
			Promo[] promos;
			logger.info("File exists in path = " + promoPath);
			promos = PromosDocument.Factory.parse(promoFile).getPromos().getPromoArray();

			List<promo> listPromos = new ArrayList<promo>();
			for (Promo p : promos) {
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
				if (p.getHyperlink() != null) {
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

		} catch (Exception e) {
			logger.error("Error while parsing promo", e);

			return null;
		}

	}
}
