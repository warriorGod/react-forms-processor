// @flow
import React, { Component, Fragment } from "react";
import FormContext from "./FormContext";
import { getFirstDefinedValue } from "../utilities/utils";
import type { FieldDef, FormContextData } from "../types";

export type InnerFormFragmentProps = FormContextData & {
  defaultFields: FieldDef[]
};

export type FormFragmentProps = {
  defaultFields: FieldDef[]
};

class FormFragment extends Component<InnerFormFragmentProps, void> {
  constructor(props: InnerFormFragmentProps) {
    super(props);
    console.log("Fragment props are", props);
    const { defaultFields = [], registerField, fields = [] } = props;
    defaultFields.forEach(field => {
      if (fields.find(existingField => existingField.id === field.id)) {
        console.warn("Fragment tried to re-register field", field.id);
      } else {
        console.log("about to register a field");
        registerField(field);
      }
    });
  }
  render() {
    const {
      defaultFields = [],
      fields,
      onFieldChange,
      renderField,
      value
    } = this.props;
    const renderedFields = defaultFields.map(field => {
      const fieldToRender = fields.find(
        registeredField => registeredField.id === field.id
      );
      if (fieldToRender && fieldToRender.visible) {
        fieldToRender.value = getFirstDefinedValue(
          value[field.name],
          field.value
        );
        console.log("Render field", fieldToRender);
        return renderField(fieldToRender, onFieldChange);
      }
      return null;
    });

    return <Fragment>{renderedFields}</Fragment>;
  }
}

export default (props: FormFragmentProps) => (
  <FormContext.Consumer>
    {form => {
      console.log("Fragment form context", form);
      return <FormFragment {...form} {...props} />;
    }}
  </FormContext.Consumer>
);