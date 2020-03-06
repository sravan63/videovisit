package org.kp.tpmg.ttg.webcare.videovisits.member.web.utils;

import java.util.Map;

import org.apache.commons.collections.MapUtils;
import org.apache.log4j.Logger;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

public class GsonUtil {
	
	private static final Logger logger = Logger.getLogger(GsonUtil.class);
	
	public static JsonObject getJsonAsObject (String json) {
		
		JsonObject jObject = null;
		
		if(json != null) {
			JsonElement jElement = new JsonParser().parse(json);
			jObject = jElement.getAsJsonObject();
		}
		
		return jObject;
	}
	
	public static String getValueAsString (JsonObject jObject, String key) {
		String value = null;
		
		if(jObject != null) {
			value = jObject.get(key).toString();
		}
		
		return value;
	}
	
	public static String getValueAsStringWithoutQuotes (JsonObject jObject, String key) {
		String value = null;
		
		if(jObject != null) {
			value = jObject.get(key).getAsString();
		}
		
		return value;
	}
	
	public static int getValueAsInt (JsonObject jObject, String key) {
		int value = 0;
		
		if(jObject != null) {
			value = jObject.get(key).getAsInt();
		}
		
		return value;
	}

	public static Boolean getValueAsBoolean (JsonObject jObject, String key) {
		Boolean value = null;
		
		if(jObject != null) {
			value = jObject.get(key).getAsBoolean();
		}
		
		return value;
	}
	
	public static boolean updateProperty (JsonObject jObject, String key, String val) {
		boolean result = false;
		
		if (jObject != null && key != null && !key.trim().equalsIgnoreCase("")) {
			jObject.remove(key);
			jObject.addProperty(key, val);
			
			return result;
		}
		
		return result;
	}
	
	public static String getJsonAsString (Object obj) {
		
		String returnJsonStr = null;		
		if(obj != null) {
			Gson gson = new Gson();
			returnJsonStr = gson.toJson(obj);
		}		
		return returnJsonStr;
	}	
	
	public static String convertMapToJsonString(final Map<String, String> map) {
		logger.info(LOG_ENTERED);
		String jsonString = null;
		final Gson gson = new GsonBuilder().serializeNulls().create();
		if(MapUtils.isNotEmpty(map)) {
			jsonString = gson.toJson(map);
		}
		logger.info(LOG_EXITING);
		return jsonString;
	}
	
}
