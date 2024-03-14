'use client'

import memberData from '@/app/data/members.json'

export default function Member() {

  function memberDetails() {
    let childs = []
    for (let i = 0; i < memberData.length; i++) {
      childs.push(
        <div className="px-5 py-5 border border-solid border-gray-300 rounded-xl bg-white cursor-pointer" key={memberData[i].name}>
          <h1 className='font-montserrat font-light text-lg'>{memberData[i].name}</h1>
          {memberData[i].linkedin && (
            <a className="underline text-blue-500" href={memberData[i].linkedin} target='_blank'>Linkedin</a>
          )}
        </div>
      )
    }

    return childs
  }

  return (
    <section className="py-20 space-y-20 px-10">
      <h1 className="text-center font-bold text-3xl font-montserrat">
        Team Member
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {memberDetails()}
      </div>
    </section>
  );
}