(function() {
  var formatEvents, slugify;

  slugify = function(name) {
    return name.toLowerCase().replace(/[^\w]/g, '-');
  };

  formatEvents = function(data) {
    var $more_link, $placeholder, $template_date, $template_event, base_link, events, items_displayed, month;
    $placeholder = $('#upcoming-template > .upcoming-list').clone();
    $template_date = $('.upcoming-date', $placeholder);
    $template_event = $('.upcoming-event', $placeholder);
    $more_link = $('.upcoming-more', '#upcoming-template');
    $placeholder.empty();
    base_link = $more_link.find('a').attr('href');
    data.filter(function(item) {
      return item['type'] === 'series' && item['talks'];
    }).forEach(function(item) {
      return item['talks'].forEach(function(talk) {
        talk['name'] = item.name + ': ' + talk.title;
        talk['start'] = talk.start.split(' ')[0];
        return data.push(talk);
      });
    });
    events = data.filter(function(item) {
      return item['type'] !== 'series';
    });
    items_displayed = 0;
    month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    events.sort(function(a, b) {
      return a.start > b.start;
    }).forEach(function(item) {
      var $date, $event, date, keyword, keyword_match;
      date = new Date(item.start);
      $date = $template_date.clone();
      $event = $template_event.clone();
      keyword = new RegExp('conf', 'i');
      keyword = void 0;
      if (keyword) {
        keyword_match = item.description.match(keyword) || item.name.match(keyword) || (item.tag && item.tag.match(keyword));
      } else {
        keyword_match = true;
      }
      $date.find('.day').html(date.getDate()).end().find('.month').html(month[date.getMonth()]).end().attr('title', item.start);
      $event.find('a').html(item.name).attr('title', item.description).attr('href', base_link + '#' + slugify(item.name));
      if (date >= Date.now() && items_displayed < 15 && keyword_match) {
        items_displayed++;
        return $placeholder.append($date).append($event);
      }
    });
    return $('#upcoming').html($placeholder).append($more_link);
  };

  $(function() {
    var eventsData;
    eventsData = '//rhevents-duckosas.rhcloud.com/upcoming.json';
    return $.get(eventsData, formatEvents);
  });

}).call(this);
