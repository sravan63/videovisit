package org.kp.tpmg.ttg.webcare.videovisits.member.web.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@Configuration
@EnableWebMvc
@ComponentScan(basePackages = "org.kp.tpmg.ttg.webcare.videovisits.member")
public class MemberRestConfiguration {

}
