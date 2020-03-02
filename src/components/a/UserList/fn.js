export const func = {
  checkConfirmed: (__) => {
    const { invited, crew } = __
    let invited_ = [];
    return new Promise(async resolve => {
      for (let item of invited) {
        let filterCrew = crew.filter(a => a.id === item.id)
        let crewIncludesUser = filterCrew.length > 0;

        if (crewIncludesUser) {
          item.isConfirmed = true;
          invited_.push(item)
        }
        else {
          item.isConfirmed = false;
          invited_.push(item)
        }
      }
      resolve(invited_)
    })

  },
  shuffle: (array) => {
    let a = [...array]

      let a0 = a[0];
      a.shift();
      a.push(a0);

      return a;
  }
}


export default func;
