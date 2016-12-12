import React from 'react';

const Menu = (props) =>{
	const { lines, changeFilter, currFilter, stationCount } = props;


	return (
		<div className="Menu">
			<h3>Existing Portland Rail Stations</h3>
			<p>Filter by Line ({props.numLines} total)</p>
      
      { currFilter === '*' &&
        <p><strong>{stationCount} total stations</strong></p>
      }

      { currFilter !== '*' &&
        <p><strong>{currFilter}: {stationCount} stations</strong></p>
      }

      <select defaultValue="*"
        type="select"
        name="filterlines"
        onChange={(e) => changeFilter(e)}>
          {
            lines.map((line, i) => {
              return (
                  <option value={line} key={i}>{line}</option>
                );
            }, this)
          }
      </select>
		</div>
	)
}

Menu.propTypes = {
  numLines: React.PropTypes.number,
  lines:React.PropTypes.array
}

export default Menu