CHECKBOXES jQuery Plugin.
=========================

### About

Select multiple checkboxes by array of qualifiers in hidden data attributes, buttons enable/disable based on relevant selected checkboxes.

Includes support for master checkbox to select all, buttons can be set to check off boxes by their qualifiers.

By Reece Fowell <reece [at] codeconsortium [dot] com>

### Setup

To use this plugin please add jQuery to your site.

This plugin was built using jQuery 1.7.1.

Usage is simple, just add the data attribute below to the container of your checkbox list like so:

``` html
<div data-checkboxes>
	<input type="checkbox" id="check_all" name="check_all" data-master-checkbox="1">
	
	<table>
		<tr>
			<td><input type="checkbox" name="message_1" data-qualifiers='["unread", "flagged"]'></td>
			<td>RE: Electronic Flight tickets</td>
		</tr>
		<tr>
			<td><input type="checkbox" name="message_2" data-qualifiers='["unread"]'></td>
			<td>RE: How did your trip go?</td>
		</tr>
		<tr>
			<td><input type="checkbox" name="message_3" data-qualifiers='["read", "junk", "spam", "flagged"]'></td>
			<td>RE: Buy cr@pola now for $$$</td>
		</tr>
	</table>
</div>
```

The above is just a simple mockup of this in practice.

Notice the 'data-checkboxes' in the wrapping div, jQuery.Checkboxes will pick up on this and setup the plugin for you.

Anything else related to this plugin, such as master checkboxes, buttons etc should reside within the container with the data attribute.

You do not have to use a table to contain your checkboxes, you can place them elsewhere, like say divs laid out in rows.

## Master checkbox

All that is needed for the master checkbox to work, is to add the 'data-master-checkbox="1"' attribute.

It is best to usually place this in the table header, or somewhere away from the regular checkboxes to not confuse the user.
``` html
<input type="checkbox" name="check_all" data-master-checkbox="1">
```

## Qualifiers

A qualifier is a sort of tag used to identify checkboxes and buttons. When using buttons to select checkboxes containing certain qualifiers,
like say "junk" for example, all checkboxes with the qualifier "junk" will be selected. 

Qualifiers should be in a valid JSON array format, therefor each qualifier in the array must be in double quotes, and all wrapped in one set of square brackets.
Because of escaping, the string containing the array must be wrapped in single quotes, as shown below:

``` html
<input type="checkbox" name="message_1" data-qualifiers='["read", "junk", "flagged"]'>
```

If the JSON array format is not followed for the data attribute 'data-qualifiers' the plugin will likely not work.

Each checkbox should have the attribute data-qualifiers, if you have no qualifiers for the attribute, then use empty brackets to ensure it is still a valid JSON style array like so.

``` html
<input type="checkbox" name="message_1" data-qualifiers='[]'>
```

Remember, do not wrap the array in double quotes, otherwise it will not work.

Below, is an example, of dropdown menu, done in the twitter-bootstrap style, each link has the attribute 'data-qualifier', and one 'data-select-none' attribute.

``` html
<div class="btn-group">
	<a href="#" class="btn dropdown-toggle" data-toggle="dropdown">
		<i class="icon-check"></i>
		<span class="caret"></span>
	</a>
	<ul class="dropdown-menu">
		<li>
			<a href="#" data-select-none="true">None</a>
		</li>
		<li>
			<a href="#" data-qualifier="read">Read</a>
		</li>
		<li>
			<a href="#" data-qualifier="unread">Unread</a>
		</li>
		<li>
			<a href="#" data-qualifier='["junk", "spam"]'>Junk</a>
		</li>
	</ul>
</div>
```

The data-qualifier on any link or button, will find and select all checkboxes within the container and check them off once clicked.

The value can be either a valid JSON array, or a string, the plugin will handle the rest.

As long as the qualifier stated can be found in one or more of the checkboxes they will be ticked off.


## Bootstrapping

If you want to kick off the plugin in some other way than the data-checkboxes attribute within a containing element, use the following and substitute the selector of your choosing:

```html
<head>
	<script type="text/javascript">
		$(document).ready(function() {
			$('div.checkboxes').checkboxes();
		});
	</script>
</head>
```

