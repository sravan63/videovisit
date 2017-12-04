package org.kp.tpmg.ttg.webcare.videovisits.member.web.parser;

import java.io.File;
import java.io.FileInputStream;
import java.util.Properties;
import java.util.ResourceBundle;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.mdo.xml.videolink.VideoLinkDocument;
import org.kp.tpmg.ttg.mdo.xml.videolink.VideoLinkDocument.VideoLink;

public class VideoLinkParser {

	private static final Logger logger = Logger.getLogger(VideoLinkParser.class);

	public static videolink parse() {

		try {
			ResourceBundle rbInfo = ResourceBundle.getBundle("configuration");
			logger.debug("configuration: resource bundle exists video visit external properties file location: "
					+ rbInfo.getString("VIDEOVISIT_EXT_PROPERTIES_FILE"));
			// Read external properties file
			File file = new File(rbInfo.getString("VIDEOVISIT_EXT_PROPERTIES_FILE"));
			FileInputStream fileInput = new FileInputStream(file);
			Properties appProp = new Properties();
			appProp.load(fileInput);
			String videoLinkPath = appProp.getProperty("MDO_VIDEO_LINK_PATH");
			File videoLinkFile = new File(videoLinkPath);
			VideoLink videoLink;
			logger.info("File exists in path = " + videoLinkPath);
			videoLink = VideoLinkDocument.Factory.parse(videoLinkFile).getVideoLink();

			videolink v = new videolink();
			if (videoLink != null) {
				String abstractText = videoLink.getAbstract();
				String title = videoLink.getTitle();
				String id = videoLink.getID();
				v.setId(id);
				v.setAbstractText(abstractText);
				v.setTitle(title);

				if (videoLink.getImage() != null) {
					String path = videoLink.getImage().getPath();
					String iconTitle = videoLink.getImage().getImageTitle();
					icon vi = new icon();
					vi.setPath(path);
					vi.setTitle(iconTitle);
					v.setVideoIcon(vi);
				}
			}

			return v;

		} catch (Exception e) {
			logger.error("Error while parsing video link", e);

			return null;
		}

	}
}
