import React, { setGlobal } from "reactn";
import { DatePicker } from "@blueprintjs/datetime";

import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";

export default class DatePicker_ extends React.Component {
    constructor(props) {
        super(props)
        this.state = { selectedDate: new Date() };
    }
    

render() {
    // name of modifier function becomes the suffix for the CSS class above
    const modifiers = { isSunday };
    return (
        <DatePicker
            modifiers={modifiers}
            onChange={(newDate) => this.handleChange(newDate)}
            value={this.state.selectedDate}
        />
    );
}

handleChange(date: Date) {
    if (!isSunday(date)) {
        this.setState({ selectedDate: date });
    }
}
}

function isSunday(date: Date) {
    return date.getDay() === 0;
}