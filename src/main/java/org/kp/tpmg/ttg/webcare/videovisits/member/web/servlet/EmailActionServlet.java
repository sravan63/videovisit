package org.kp.tpmg.ttg.webcare.videovisits.member.web.servlet;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;

public class EmailActionServlet extends HttpServlet {

	private static final long serialVersionUID = 5283735648488487841L;

	public static final Logger logger = LoggerFactory.getLogger(EmailActionServlet.class);

	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException {
		doGet(request, response);
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException {
		logger.info(LOG_ENTERED);
		response.setContentType("image/x-png");
		ServletOutputStream out = null;
		String meetingId = "";
		String userType = "";
		String userAction = "";
		try {
			meetingId = request.getParameter("meetingId");
			userType = request.getParameter("userType");
			userAction = request.getParameter("userAction");
			logger.info("Input [meetingId : " + meetingId + ", userType : " + userType
					+ ", userAction : " + userAction + ", sessionId : " + request.getSession().getId() + "]");

			MeetingCommand.updateEmailAction(meetingId, userType, userAction, request.getSession().getId());

			out = response.getOutputStream();
			final int width = 1, height = 1;
			BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
			Graphics2D graphics2d = image.createGraphics();
			graphics2d.setColor(Color.RED);
			graphics2d.fillRect(0, 0, width, height);
			graphics2d.drawString("", width, height);
			graphics2d.dispose();
			ImageIO.write(image, "png", out);
		} catch (Exception e) {
			logger.warn("Error updating email interation for meeting : " + meetingId, e);
		} finally {
			try {
				if(out != null) {
					out.close();
				}
			} catch (Exception e) {
				logger.error("Error while closing resources : ", e);
			}

		}
		logger.info(LOG_EXITING);
	}
}
