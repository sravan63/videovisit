package org.kp.tpmg.ttg.webcare.videovisits.member.web.parser;

import java.io.File;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.mdo.xml.videolink.VideoLinkDocument;
import org.kp.tpmg.ttg.mdo.xml.videolink.VideoLinkDocument.VideoLink;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.AppProperties;

public class VideoLinkParser {

	private static final Logger logger = Logger.getLogger(VideoLinkParser.class);

	public static videolink parse() {

		try {
			String videoLinkPath = AppProperties.getExtPropertiesValueByKey("MDO_VIDEO_LINK_PATH");
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
