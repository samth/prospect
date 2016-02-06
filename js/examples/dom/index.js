var G;
$(document).ready(function () {
  var Network = Syndicate.Network;
  var sub = Syndicate.sub;
  var assert = Syndicate.assert;
  var retract = Syndicate.retract;
  var __ = Syndicate.__;
  var _$ = Syndicate._$;

  G = new Syndicate.Ground(function () {
    console.log('starting ground boot');

    Syndicate.DOM.spawnDOMDriver();

    Network.spawn({
      boot: function () {
	return assert(["DOM", "#clicker-holder", "clicker",
		       ["button", ["span", [["style", "font-style: italic"]], "Click me!"]]])
	  .andThen(sub(["jQuery", "button.clicker", "click", __]));
      },
      handleEvent: function (e) {
	if (e.type === "message" && e.message[0] === "jQuery") {
	  Network.send("bump_count");
	}
      }
    });

    Network.spawn({
      counter: 0,
      boot: function () {
	this.updateState();
	return sub("bump_count");
      },
      updateState: function () {
	Network.stateChange(retract(["DOM", __, __, __])
			    .andThen(assert(["DOM", "#counter-holder", "counter",
					     ["div",
					      ["p", "The current count is: ", this.counter]]])));
      },
      handleEvent: function (e) {
	if (e.type === "message" && e.message === "bump_count") {
	  this.counter++;
	  this.updateState();
	}
      }
    });
  });

  G.network.onStateChange = function (mux, patch) {
    $("#spy-holder").text(Syndicate.prettyTrie(mux.routingTable));
  };

  G.startStepping();
});
