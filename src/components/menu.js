import React from 'react';

const Menu = (props) => {
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

      <select 
        defaultValue="*"
        type="select"
        name="filterlines"
        onChange={e => changeFilter(e)}
      >
        {
          lines.map(line => <option value={line} key={line}>{line}</option>, this)
        }
      </select>
    </div>
  );
};

Menu.propTypes = {
  numLines: React.PropTypes.number.isRequired,
  lines: React.PropTypes.array.isRequired,
  changeFilter: React.PropTypes.func.isRequired, 
  currFilter: React.PropTypes.string.isRequired,
  stationCount: React.PropTypes.number.isRequired,
};

export default Menu;