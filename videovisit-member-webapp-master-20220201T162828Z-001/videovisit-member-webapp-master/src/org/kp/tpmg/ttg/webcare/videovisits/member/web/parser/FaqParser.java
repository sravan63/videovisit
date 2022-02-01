package org.kp.tpmg.ttg.webcare.videovisits.member.web.parser;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.mdo.xml.faqlist.FAQItemDocument.FAQItem;
import org.kp.tpmg.ttg.mdo.xml.faqlist.FAQListDocument;
import org.kp.tpmg.ttg.mdo.xml.faqlist.FAQListDocument.FAQList;
import org.kp.tpmg.ttg.mdo.xml.faqlist.HyperlinkDocument.Hyperlink;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.AppProperties;

public class FaqParser {

	private static final Logger logger = Logger.getLogger(FaqParser.class);

	/**
	 * @param args
	 */

	public static faq parse() {

		try {
			String faqPath = AppProperties.getExtPropertiesValueByKey("MDO_FAQ_PATH");
			// String faqPath = rbInfo.getString("MDO_FAQ_PATH");
			File faqFile = new File(faqPath);
			FAQList faqList;
			logger.info("File exists in path = " + faqPath);
			faqList = FAQListDocument.Factory.parse(faqFile).getFAQList();

			faq f = new faq();
			String faqListTitle = faqList.getFAQListTitle();

			f.setFaqListTitle(faqListTitle);
			if (faqList.getFAQItems() != null && faqList.getFAQItems().getFAQItemArray() != null) {
				List<faqitem> lstFaqItem = new ArrayList<faqitem>();

				for (FAQItem faqItem : faqList.getFAQItems().getFAQItemArray()) {
					faqitem item = new faqitem();

					String faqItemHeader = faqItem.getFAQItemHeader();
					String id = faqItem.getID();
					int sequence = faqItem.getSequence().intValue();

					if (faqItemHeader == null) {
						logger.info("faqItemHeader is null");
					} else {
						logger.info("faqItemHeader: " + faqItemHeader);
					}

					if (id == null) {
						logger.info("faqItem id is null");
					} else {
						logger.info("faqItem id: " + id);
					}

					logger.info("Sequence: " + sequence);

					String orientation = faqItem.getOrientation();
					item.setHeader(faqItemHeader);
					item.setId(id);
					item.setOrientation(orientation);
					item.setSequence(sequence);
					if (faqItem.getHyperlinkArray() != null) {
						List<hyperlink> listLinks = new ArrayList<hyperlink>();

						for (Hyperlink hyperlink : faqItem.getHyperlinkArray()) {
							hyperlink link = new hyperlink();
							String abstractText = hyperlink.getAbstract();
							String title = hyperlink.getTitle();
							String url = hyperlink.getUrl();

							if (title == null) {
								logger.info("Hyperlink title is null");
							} else {
								logger.info("Hyperlink title: " + title);

							}

							if (url == null) {
								logger.info("Hyperlink url is null");
							} else {
								logger.info("Hyperlink url:" + url);

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
		} catch (Exception e) {
			logger.error("Error while parsing Faq", e);

			return null;
		}

	}
}
