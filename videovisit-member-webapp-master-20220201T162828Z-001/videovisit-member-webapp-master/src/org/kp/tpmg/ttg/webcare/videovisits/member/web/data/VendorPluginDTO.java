/**
 * 
 */
package org.kp.tpmg.ttg.webcare.videovisits.member.web.data;

import java.io.Serializable;

/**
 * @author ranjeetpatil
 *
 */
public class VendorPluginDTO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -5285672636975991066L;

	private String vendorPluginName;
	private String vendorNewPlugin;
	private String vendorOldPlugins;

	/**
	 * @return the vendorNewPlugin
	 */
	public String getVendorNewPlugin() {
		return vendorNewPlugin;
	}

	/**
	 * @param vendorNewPlugin
	 *            the vendorNewPlugin to set
	 */
	public void setVendorNewPlugin(String vendorNewPlugin) {
		this.vendorNewPlugin = vendorNewPlugin;
	}

	/**
	 * @return the vendorOldPlugins
	 */
	public String getVendorOldPlugins() {
		return vendorOldPlugins;
	}

	/**
	 * @param vendorOldPlugins
	 *            the vendorOldPlugins to set
	 */
	public void setVendorOldPlugins(String vendorOldPlugins) {
		this.vendorOldPlugins = vendorOldPlugins;
	}

	/**
	 * @return the vendorPluginName
	 */
	public String getVendorPluginName() {
		return vendorPluginName;
	}

	/**
	 * @param vendorPluginName
	 *            the vendorPluginName to set
	 */
	public void setVendorPluginName(String vendorPluginName) {
		this.vendorPluginName = vendorPluginName;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "VendorPluginDTO [vendorPluginName=" + vendorPluginName + ", vendorNewPlugin=" + vendorNewPlugin
				+ ", vendorOldPlugins=" + vendorOldPlugins + "]";
	}

}
