<!--
/*
 * This file is part of the CCDNComponent CommonBundle
 *
 * (c) CCDN (c) CodeConsortium <http://www.codeconsortium.com/> 
 * 
 * Available on github <http://www.github.com/codeconsortium/>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Plugin jQuery.Profile
 *
 * @author Reece Fowell <reece at codeconsortium dot com>
 *
 * Requires JQuery, make sure to have JQuery included in your JS to use this.
 * JQuery needs to be loaded before this script in order for it to work.
 */
$(document).ready(function() {
	$().checkboxes();
	
});
	
(function($) {
	$.fn.checkboxes = function() {
		

		
		/**
		 *
		 * Ticks the checkboxes that are passed to it
		 * and highlights the table rows background colour.
		 */
		function select_rows($rows, $highlight)
		{
			if ($rows.size() > 0)
			{
				var result = $([]);

				$rows = $rows.each(function(index, node) {
					$row = $(node).parents('tr').first();

					if ($row)
					{
						result = result.add($row);
					}
				});
				
				if ($highlight)
				{
					// add highlight colour
					result.removeClass('mark_checked').addClass('mark_checked');
					$rows.attr('checked', true);
					
				} else {
					// remove highlight colour
					result.removeClass('mark_checked');
					$rows.attr('checked', false);
				}
			}
			
			return;
		}
		
		
		
		/**
		 *
		 * Enables/Disables toolbar buttons when no checkboxes
		 * are ticked belonging to the same identified group.
		 */
		function toggle_controls($form_identifier, $identifiable_checkboxes)
		{
			//
			// disable registered actions
			//
			var $responds_disabled_actions = $("[data-responds-disabled='" + $form_identifier + "']");
			var $responds_hidden_actions =  $("[data-responds-hidden='" + $form_identifier + "']");

			if ($responds_disabled_actions.size() > 0)
			{
				if ($identifiable_checkboxes.filter(':checked').size() > 0)
				{
					$responds_disabled_actions.removeClass('disabled');
					$responds_disabled_actions.removeAttr('disabled');
				} else {
					$responds_disabled_actions.removeClass('disabled').addClass('disabled');
					$responds_disabled_actions.attr('disabled', '');
				}
			}
			
			if ($responds_hidden_actions.size() > 0)
			{
				if ($identifiable_checkboxes.filter(':checked').size() > 0)
				{
					$responds_hidden_actions.removeClass('hidden');
				} else {
					$responds_hidden_actions.removeClass('hidden').addClass('hidden');
				}
			}
		}
		
		
		
		/**
		 *
		 * Ticks/Unticks individual checkboxes or all if master checkbox is ticked.
		 * Also ensures that the 'check all' checkbox is unticked if a single
		 * checkbox in its group gets unticked.
		 */
		$(":checkbox").click(function(event) {
			
			// what was clicked.
			this.checkbox = $(this);
			
			if ( ! $(this).data("identifier"))
			{				
				return true;
			}
			
			// get group identifier
			var $form_identifier = $(this).data("identifier");
			
			// Group Checkboxes of the identifier.
			var $identifiable_checkboxes = $(":checkbox[data-identifier='" + $form_identifier + "']");

			// Master Checkbox of the identifier.
			var $master = $(":checkbox[data-action-toggle='" + $form_identifier + "']");
			
			//
			// For when we check the master
			//
			if (this.checkbox.filter($master).size() > 0)
			{
				//
				// if more than half are checked, then uncheck, vice-versa
				//
				if ($master.is(':checked'))
				{					
					// highlight table row
					select_rows($identifiable_checkboxes.not($master), true);
				} else {					
					// unhighlight table row
					select_rows($identifiable_checkboxes.not($master), false);
				}
			} else {
			//
			// For when we check individual checkboxes
			//	
				if (this.checkbox.is(':checked'))
				{
					// highlight row
					select_rows(this.checkbox, true);
										
				} else {
					// unhighlight row
					select_rows(this.checkbox, false);
					
					// uncheck master
					$master.attr('checked', false);
				}
			}

			toggle_controls($form_identifier, $identifiable_checkboxes.not($master));
							
			return true;
		});
		
		
		
		/**
		 *
		 * Tick all checkboxes that match the data-qualifier
		 * attribute of the requesting button or link. 
		 */
		$("[data-action^='select_all']").click(function(event) {
		
			// what was clicked.
			this.check_all = $(this);

			if ( ! $(this).data("qualifier") || ! $(this).data("identifier"))
			{			
				return true;
			}
					
			// get the identifier of action which will match qualifying checkboxes.
			var $form_identifier = $(this).data("identifier");
			var $request_qualifier = $(this).data("qualifier");
			
			// get the checkboxes that match the qualifier from the item clicked. 
			var $identifiable_checkboxes = $(":checkbox[data-identifier='" + $form_identifier + "']");
			var $qualified_checkboxes = $(':checkbox[data-qualifier~="' + $request_qualifier + '"]'); //.attr('checked', true);

			if ($identifiable_checkboxes.size() > 0 && $qualified_checkboxes.size() > 0)
			{
				// filter checkboxes
				$rows = $identifiable_checkboxes.filter($qualified_checkboxes);
			
				if ($rows.size() > 0)
				{
					// Highlight row
					select_rows($rows, true);
				}
			
				// Enable registered actions
				toggle_controls($form_identifier, $identifiable_checkboxes);
			}
				
			return true;
		});
		
		
		
		/**
		 *
		 * Untick all checkboxes that match the data-qualifier
		 * attribute of the requesting button or link.
		 */
		$("[data-action^='select_none']").click(function(event) {
		
			// what was clicked.
			this.check_all = $(this);

			if ( ! $(this).data("identifier"))
			{
				return true;
			}
					
			// get the identifier of action which will match qualifying checkboxes.
			var $form_identifier = $(this).data("identifier");
			
			// get the checkboxes that match the qualifier from the item clicked. 
			var $identifiable_checkboxes = $(":checkbox[data-identifier='" + $form_identifier + "']");

			if ($identifiable_checkboxes.size() > 0)
			{
				// Highlight row
				select_rows($identifiable_checkboxes, false);
				
				// Disable registered actions
				toggle_controls($form_identifier, $identifiable_checkboxes);
			}
			
			return true;
		});
		
	}

})(jQuery);

//-->