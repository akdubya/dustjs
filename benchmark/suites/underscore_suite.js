(function(exports){

var benches = {

  string: {
    source:  "Hello World!",
    context: {}
  },

  replace: {
    source:  "Hello <%= name %>! You have <%= count %> new messages.",
    context: { name: "Mick", count: 30 }
  },

  array: {
    source:   "<% _.each(names, function(item) { %> <%= item.name %> <% }); %>",
    context:  { names: [{name: "Moe"}, {name: "Larry"}, {name: "Curly"}, {name: "Shemp"}] }
  },

  object: {
    source:   "<%= person.name %> <%= person.age %>",
    context:  { person: { name: "Larry", age: 45 } }
  },

  partial: {
    source:   "<% _.each(peeps, function(peep) { %> <%= partials.myPartialTemplate(peep) %> <% }); %>",
    context:  { peeps: [{name: "Moe", count: 15}, {name: "Larry", count: 5}, {name: "Curly", count: 1}] },
    partials: { myPartialTemplate: "Hello <%= name %>! You have <%= count %> new messages." }
  },

  recursion: {
    source:   "<%= name %> <% _.each(kids, function(kid) { %> <%= partials.recursion({data:kid, partials:partials}) %> <% }); %>",
    context:  {
                name: '1',
                kids: [
                  {
                    name: '1.1',
                    kids: [
                      {name: '1.1.1'}
                    ]
                  }
                ]
              },
    partials: { recursion: "<%= data.name %> <% _.each(data.kids, function(kid) { %> <%= partials.recursion({data:kid, partials:partials}) %> <% }); %>" }
  },

  filter: {
    source:   "foo <%= filter(bar) %>",
    context:  {
                filter: function(str) {
                  return str.toUpperCase();
                },
                bar: "bar"
              }
  },

  complex: {
    source:  "<h1><%= header() %></h1>\n" +
             "<% if(hasItems) { %>" +
             "  <% _.each(items, function(item) { %>\n" +
             "    <ul>\n" +
             "        <% if(item.current) { %>\n" +
             "          <li><strong> <%- item.name %> </strong></li>\n" +
             "        <% } else { %>\n" +
             "          <li><a href=\" <%- item.url %> \"> <%- item.name %> </a></li>\n" +
             "        <% } %>\n" +
             "    </ul>\n" +
             "  <% }); %>" +
             "<% } else { %>\n" +
             "  <p>The list is empty.</p>\n" +
             "<% } %>",
    context: {
               header: function() {
                 return "Colors";
               },
               items: [
                 {name: "red", current: true, url: "#Red"},
                 {name: "green", current: false, url: "#Green"},
                 {name: "blue", current: false, url: "#Blue"}
               ],
               hasItems: function(ctx) {
                  return ctx.items.length ? true : false;
               }
             }
  }

};

exports.underscoreBench = function(suite, name, id) {
  var bench = benches[name],
      fn = _.template(bench.source),
      ctx = bench.context,
      partials = {};

  if (bench.partials) {
    for (var key in bench.partials) {
      partials[key] = _.template(bench.partials[key]);
    }
  }

  ctx.partials = partials;

  suite.bench(id || name, function(next) {
    fn(ctx);
    next();
  });
};

exports.underscoreBench.benches = benches;

})(typeof exports !== "undefined" ? exports : window);
