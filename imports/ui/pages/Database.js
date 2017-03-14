/**
 * Created by ingeborglianes on 13.03.2017.
 */
//Serverside

//Collection for bruker
Bruker = new Mongo.Collection('Bruker',{skjema: "Brukerskjema"});

//skjema for bruker (må være enten studentbruker eller lærerbruker)
Bruker.schema = new SimpleSchema({
    brukernavn: {type: String, unique: true},
    passord: {type: String},
    navn: {type: String},
    incompleteCount: {type: Number, defaultValue: 0},
    epost: {type: String},
});

//Collection for lærerbruker
Lærerbruker = new Mongo.Collection('Lærerbruker',{skjema: "Lærerbrukerskjema"});
//skjema for lærerbruker (en type bruker)
Lærerbruker.schema = new SimpleSchema({
    brukernavn: {type: String},
    lærerID: {type: Int},
    fagHar: {type: Array},
});

//Collection for studentbruker
Studentbruker = new Mongo.Collection('Studentbruker',{skjema: "Studentbrukerskjema"});
//skjema for studentbruker (en type bruker)
Studentbruker.schema = new SimpleSchema({
    brukernavn: {type: String},
    studnr: {type: Int},
    fagHar: {type: Array},
});

//Collection for fag
Fag = new Mongo.Collection('Fag',{skjema: "Fagskjema"});
//skjema for fag
Fag.schema = new SimpleSchema({
    fagkode: {type:String, unique: true},
    antall_studenter: {type: Int},
    navn_fagbøker: {type: Array},
    fakultet: {type: String},
});

//Collection for kapittel
Kapittel = new Mongo.Collection('Kapittel',{skjema: "Kapittelskjema"});
//skjema for kapittel (kapittel er en svak klasse av fag)
Kapittel.schema = new SimpleSchema({
    fagkode: {type:String},
    navn: {type:String},
});

//Collection for subkapittel
Subkapittel = new Mongo.Collection('Subkapittel',{skjema: "Subkapittelskjema"});
//skjema for subkapittel (subkapittel er en svak klasse av fag)
Subkapittel.schema = new SimpleSchema({
    fagkode: {type:String},
    navn: {type:String},
});

//Collection for subsubkapittel
Subsubkapittel = new Mongo.Collection('Subsubkapittel',{skjema: "Subsubkapittelskjema"});
//skjema for subsubkapittel (subsubkapittel er en svak klasse av fag)
Subsubkapittel.schema = new SimpleSchema({
    fagkode: {type:String},
    navn: {type:String},
});




