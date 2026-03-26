import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";

actor {
  type Stat = {
    id : Nat;
    name : Text;
    value : Nat;
    timestamp : Int;
  };

  module Stat {
    public func compare(a : Stat, b : Stat) : Order.Order {
      Nat.compare(a.id, b.id);
    };

    public func compareByTimestamp(a : Stat, b : Stat) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  var nextStatId = 0;
  let stats = Map.empty<Principal, Map.Map<Nat, Stat>>();

  func getUserStatsMap(user : Principal) : Map.Map<Nat, Stat> {
    switch (stats.get(user)) {
      case (null) {
        Runtime.trap("User not found. ");
      };
      case (?userStats) { userStats };
    };
  };

  public shared ({ caller }) func createStat(name : Text, value : Nat) : async Nat {
    if (value > 100) {
      Runtime.trap("Value must be between 0 and 100. ");
    };

    let userKey = caller;
    let userStats = switch (stats.get(userKey)) {
      case (null) { Map.empty<Nat, Stat>() };
      case (?existing) { existing };
    };

    if (userStats.size() >= 6) {
      Runtime.trap("Cannot create more than 6 stats. ");
    };

    let newStat : Stat = {
      id = nextStatId;
      name;
      value;
      timestamp = Time.now();
    };

    var id = nextStatId;
    userStats.add(id, newStat);
    stats.add(userKey, userStats);

    id += 1;
    id - 1;
  };

  public shared ({ caller }) func updateStat(id : Nat, newName : ?Text, newValue : ?Nat) : async () {
    let callerStats = getUserStatsMap(caller);
    switch (callerStats.get(id)) {
      case (null) {
        Runtime.trap("Stat with id " # id.toText() # " does not exist. ");
      };
      case (?stat) {
        let updatedValue = switch (newValue) {
          case (null) { stat.value };
          case (?val) {
            if (val > 100) {
              Runtime.trap("Value must be between 0 and 100. ");
            };
            val;
          };
        };

        let updatedName = switch (newName) {
          case (null) { stat.name };
          case (?name) { name };
        };

        let updatedStat = {
          stat with
          name = updatedName;
          value = updatedValue;
        };

        callerStats.add(id, updatedStat);
      };
    };
  };

  public shared ({ caller }) func deleteStat(id : Nat) : async () {
    let callerStats = getUserStatsMap(caller);
    switch (callerStats.get(id)) {
      case (null) {
        Runtime.trap("Stat with id " # id.toText() # " does not exist. ");
      };
      case (_) {
        callerStats.remove(id);
      };
    };
  };

  public query ({ caller }) func getStats() : async [Stat] {
    getUserStatsMap(caller).values().toArray().sort();
  };

  public query ({ caller }) func getStatsSortedByTimestamp() : async [Stat] {
    getUserStatsMap(caller).values().toArray().sort(Stat.compareByTimestamp);
  };
};
