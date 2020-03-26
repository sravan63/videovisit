package org.kp.tpmg.ttg.webcare.videovisits.member.web.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.view.UrlBasedViewResolver;
import org.springframework.web.servlet.view.tiles3.TilesConfigurer;
import org.springframework.web.servlet.view.tiles3.TilesView;

@Configuration
@EnableWebMvc
@ComponentScan(basePackages = "org.kp.tpmg.ttg.webcare.videovisits.member")
public class MemberRestConfiguration {

	@Bean
	public TilesConfigurer tilesConfigurer() {
		final TilesConfigurer configurer = new TilesConfigurer();
		configurer.setDefinitions(new String[] { "/WEB-INF/tiles-definitions/mobile-tiles-definitions.xml",
				"/WEB-INF/tiles-definitions/tiles-definitions.xml" });
		return configurer;
	}

	@Bean
	public UrlBasedViewResolver tilesViewResolver() {
		final UrlBasedViewResolver urlBasedViewResolver = new UrlBasedViewResolver();
		urlBasedViewResolver.setViewClass(TilesView.class);
		return urlBasedViewResolver;
	}
}
