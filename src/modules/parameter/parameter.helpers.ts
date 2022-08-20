import {
	StringParameter,
	SelectParameter,
	NumberParameter,
	BooleanParameter,
	DateParameter,
	Parameter,
	RequirableParameter,
	ParameterType,
	FormGroupedParameter,
	FormGroupedSelectParameter,
} from './entities';

export abstract class ParameterHelpers {
	parameterType: typeof ParameterType = ParameterType;

	isRequirableParameter(p?: Parameter): p is RequirableParameter {
		return p instanceof RequirableParameter;
	}
	isSelectParameter(p?: Parameter): p is SelectParameter {
		return p instanceof SelectParameter;
	}
	isNumberParameter(p?: Parameter): p is NumberParameter {
		return p instanceof NumberParameter;
	}
	isDateParameter(p?: Parameter): p is DateParameter {
		return p instanceof DateParameter;
	}
	isBooleanParameter(p?: Parameter): p is BooleanParameter {
		return p instanceof BooleanParameter;
	}
	isStringParameter(p?: Parameter): p is StringParameter {
		return p instanceof StringParameter;
	}
	isRequirableParameterFg(p?: FormGroupedParameter): p is FormGroupedParameter<RequirableParameter> {
		return this.isRequirableParameter(p?.parameter);
	}
	isSelectParameterFg(p?: FormGroupedParameter): p is FormGroupedSelectParameter {
		return this.isSelectParameter(p?.parameter);
	}
	isNumberParameterFg(p?: FormGroupedParameter): p is FormGroupedParameter<NumberParameter> {
		return this.isNumberParameter(p?.parameter);
	}
	isDateParameterFg(p?: FormGroupedParameter): p is FormGroupedParameter<DateParameter> {
		return this.isDateParameter(p?.parameter);
	}
	isBooleanParameterFg(p?: FormGroupedParameter): p is FormGroupedParameter<BooleanParameter> {
		return this.isBooleanParameter(p?.parameter);
	}
	isStringParameterFg(p?: FormGroupedParameter): p is FormGroupedParameter<StringParameter> {
		return this.isStringParameter(p?.parameter);
	}
}
