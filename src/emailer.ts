import {EmailOptions, IEmailer} from "./interface";
import {Configurable} from "./configurable";

export class Emailer<Options extends EmailOptions = EmailOptions> extends Configurable<Options> implements IEmailer {

}