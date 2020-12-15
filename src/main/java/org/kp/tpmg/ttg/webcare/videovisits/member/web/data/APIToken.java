package org.kp.tpmg.ttg.webcare.videovisits.member.web.data;

import com.google.gson.annotations.SerializedName;

public class APIToken {

	/**
	 * 
	 */
	private static final long serialVersionUID = 192869452827127015L;

	@SerializedName("access_token")
	private String accessToken;

	@SerializedName("scope")
	private String scope;

	@SerializedName("token_type")
	private String tokenType;

	@SerializedName("expires_in")
	private int expirySec;

	public String getAccessToken() {
		return accessToken;
	}

	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}

	public String getScope() {
		return scope;
	}

	public void setScope(String scope) {
		this.scope = scope;
	}

	public String getTokenType() {
		return tokenType;
	}

	public void setTokenType(String tokenType) {
		this.tokenType = tokenType;
	}

	public int getExpirySec() {
		return expirySec;
	}

	public void setExpirySec(int expirySec) {
		this.expirySec = expirySec;
	}

	@Override
	public String toString() {
		return "APIToken [accessToken=" + accessToken + ", scope=" + scope + ", tokenType=" + tokenType + ", expirySec="
				+ expirySec + "]";
	}

}
