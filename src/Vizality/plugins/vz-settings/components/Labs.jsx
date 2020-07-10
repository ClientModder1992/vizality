const { React, getModule } = require('vizality/webpack');
const { FormNotice, Switch } = require('vizality/components');

/*
 * i18n notes: this section is intentionally left not translated.
 * It's only here for the few curious people who want to brick their Discord install
 */

class Labs extends React.Component {
  render () {
    return <>
      <FormNotice
        imageData={{
          width: 60,
          height: 60,
          src: '/assets/0694f38cb0b10cc3b5b89366a0893768.svg'
        }}
        type={FormNotice.Types.DANGER}
        title='Experiments ahead!'
        body={<>Any feature you see here is under development and is likely to be unfinished and/or broken. Vizality
          staff will <b>NOT</b> provide any support, explain, or accept any bug report for those. <b>Use them at your
            own risk</b>.</>}
      />
      {vizality.api.labs.experiments.sort((a, b) => a.date > b.date ? -1 : a.date < b.date ? 1 : 0).map(e => this.renderItem(e))}
    </>;
  }

  /**
   * @param {VizalityExperiment} experiment
   */
  renderItem (experiment) {
    const enabled = vizality.api.labs.isExperimentEnabled(experiment.id);
    const date = new Date(experiment.date);
    const { colorStandard } = getModule('colorStandard');
    // No i wont write proper css
    return (
      <div key={experiment.id} className={colorStandard} style={{
        marginTop: 40,
        paddingBottom: 20,
        marginBottom: 20,
        borderBottom: 'thin solid var(--background-modifier-accent)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 15
        }}>
          <b style={{ fontSize: 20 }}>{experiment.name}</b>
          <Switch
            style={{ marginLeft: 'auto' }}
            value={enabled}
            onChange={() => {
              if (enabled) {
                vizality.api.labs.disableExperiment(experiment.id);
              } else {
                vizality.api.labs.enableExperiment(experiment.id);
              }
              this.forceUpdate(); // i am too lazy to write a half-decent thing for that
            }}
          />
        </div>
        <div>
          <b>{date.getDate().toString().padStart(2, '0')}/{(date.getMonth() + 1).toString().padStart(2, '0')}/{date.getFullYear()}</b>
          <span style={{ marginLeft: 5 }}>{experiment.description}</span>
        </div>
      </div>
    );
  }
}

module.exports = Labs;
