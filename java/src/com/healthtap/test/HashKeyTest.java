/**
 * Copyright © 2016-2017, HealthTap, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.healthtap.test;

import junit.framework.TestCase;
import com.healthtap.HashKey;

/**
 * @author edwin
 *
 */
public class HashKeyTest extends TestCase
{
	public void testHashKeySimpleTexts1()
	{
		assertEquals("r32020327", HashKey.hash("Medications in your profile"));
		assertEquals("r835310324", HashKey.hash("All medications"));
		assertEquals("r103883086", HashKey.hash("Conditions"));
		assertEquals("r481086103", HashKey.hash("Symptoms"));
		assertEquals("r343852585", HashKey.hash("Experts"));
	}

	public void testHashKeySimpleTexts2()
	{
		assertEquals("r807691021", HashKey.hash("Procedures"));
		assertEquals("r941505899", HashKey.hash("Health Apps"));
		assertEquals("r240633868", HashKey.hash("Conditions in your profile"));
		assertEquals("r795086964", HashKey.hash("Treatment Reviews"));
		assertEquals("r221604632", HashKey.hash("Answers"));
	}

	public void testHashKeySimpleTexts3()
	{
		assertEquals("r669315500", HashKey.hash("Private Health Profile"));
		assertEquals("r710774033", HashKey.hash("People you care for"));
		assertEquals("r284964820", HashKey.hash("Notifications"));
		assertEquals("r613036745", HashKey.hash("News"));
		assertEquals("r216617786", HashKey.hash("More Tips"));
		assertEquals("r788359072", HashKey.hash("Goals"));
		assertEquals("r140625167", HashKey.hash("Referral Link"));
		assertEquals("r256277957", HashKey.hash("Questions"));
		assertEquals("r18128760", HashKey.hash("Private consults"));
		assertEquals("r584966709", HashKey.hash("Suggested doctors for you"));
	}

	public void testHashKeyEscapes()
	{
		assertEquals("r926831062", HashKey.hash("Can\'t find treatment id"));
		assertEquals("r909283218", HashKey.hash("Can\'t find an application for SMS"));
	}
	
	public void testHashKeyPunctuation()
	{
		assertEquals("r382554039", HashKey.hash("{topic_name}({topic_generic_name})"));
		
		assertEquals("r436261634", HashKey.hash("{doctor_name}, {sharer_name} {start}found this helpful{end}"));
		assertEquals("r858107784", HashKey.hash("{sharer_name} {start}found this helpful{end}"));
		assertEquals("r522565682", HashKey.hash("Grow your Care-Team"));
		assertEquals("r1015770123", HashKey.hash("Failed to send connection request!"));
		assertEquals("r993422001", HashKey.hash("{goal_name} Goals"));
		assertEquals("r201354363", HashKey.hash("Referral link copied!"));
	}
	
	public void testHashKeyCompressWhiteSpace()
	{
		assertEquals("r926831062", HashKey.hash("Can\'t find treatment id"));
		assertEquals("r926831062", HashKey.hash("Can\'t    find    treatment           id"));
		
		assertEquals("r909283218", HashKey.hash("Can\'t find an application for SMS"));
		assertEquals("r909283218", HashKey.hash("Can\'t   \t\n \t   find an    \t \n \r   application for SMS"));
	}
	
	public void testHashKeyTrimWhiteSpace()
	{
		assertEquals("r926831062", HashKey.hash("Can\'t find treatment id"));
		assertEquals("r926831062", HashKey.hash("      Can\'t find treatment id "));
		
		assertEquals("r909283218", HashKey.hash("Can\'t find an application for SMS"));
		assertEquals("r909283218", HashKey.hash(" \t\t\n\r    Can\'t find an application for SMS   \n \t \r"));
	}

	public void testHashKeyDoubleBackslash()
	{
		assertEquals("r968833504", HashKey.hash("A \\\\n B"));
	}
}
