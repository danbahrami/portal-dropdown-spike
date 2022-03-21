# A spike into rendering dropdowns inside a scrollable panel

I wanted to see how we can render wide dropdowns inside a scrollable panel so that the dropdowns go outside the bounds of the panel.

This is not achievable purely with CSS because scrollable elements always have an `overflow-y: hidden` rule applied to them.

### Requirements

1. The dropdown must be able to extend outside the bounds of a scrollable ancestor element.
2. The dropdown box must maintain a position next to its dropdown input
3. The dropdown component must have a reuseable API (not specific to being inside a scrollable element)

## Try it out at home

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## The approach

### Step 1: render the dropdown box in a portal

Using a portal to render the dropdown box lets us escape the overflow context of the panel by rendering it at the top level of the document.

The dropdown box is positioined absolutely and uses the dropdown input element as a positioning reference.

With this we can render a dropdown that extends outside the bounds of the panel. But there is a problem.

When you scroll the side panel the dropdown stays exactly where it is. So onto the next step:

### Step 2: close the open dropdown when the sidepanel scrolls

If you're focused on a dropdown and then scroll the sidepanel the dropdown should either:

1. update its position to always sit underneath its dropdown input
2. close

Option 1 comes with its own set of problems - for example, what happens when you scroll all the way up? Does the Dropdown get cut off by the panel header or does it stay visible until it's completely scrolled out of site?

I was scepticle that option 2 would feel good but I tried it and actually, it feels really natural.

I achieved it by exposing a close function through a ref on the dropdown component - similar to how you can call `ref.focus()` on an input element ref, you can call `ref.close()` on a dropdown component ref.

```js
const dropdownRef = useRef();

const handleScroll = () => {
  dropdownRef.current.close();
};

<div onScroll={handleScroll}>
  <Dropdown ref={dropdownRef} />
</div>;
```

In reality this causes slow performance but you can debounce the scroll event to only fire when you first start closing and it feels buttery smooth.

The story isn't quite finished yet though. We have two further problems.

1. When you scroll a bit and then open the dropdown the box is positioned as if you never scrolled the panel. (it doesnt sit right next to its input)
2. Because the dropdown options now sit at the document top level they are disconnected from their input when it comes to accessibility.

So lets solve those!

### Position the dropdown box to account for the panel scroll position

The problem is that the dropdown box needs an absolute position that is aware of the input's position inside the panel and also the scrolltop of the panel itself. To achieve this I've allowed the parent to override the position of the dropdown box with a function prop. The function gets given the bounding rectangle of the drodpown input as an argument.

By default the function prop sits the dropdown underneath the input:

```js
Dropdown.defaultProps = {
  boxPosition: (inputRect) => ({
    top: inputRect.bottom,
    left: inputRect.left,
  }),
};
```

But the parent can override this to include the panel scroll position:

```js
<Dropdown
  boxPosition={(inputRect) => ({
    top: inputRect.bottom - panelScrollTop,
    left: inputRect.left,
  })}
/>
```

### Make the dropdown accessible

I found this great resource on how to make an accessible "combobox" https://w3c.github.io/aria-practices/examples/combobox/combobox-select-only.html

The basic steps are:

1. Give the dropdown input, input box and each option element a predictable id.
1. Mark the dropdown input as `role="combobox"`
1. Mark the dropdown box as `role="listbox"`
1. Mark each option as `role="option"`
1. Tell the dropdown where to find the controls with `aria-controls="{listbox-id"}`
1. Tell the dropdown which option is selected with `aria-activedescendant="{current-option-id}"`

I event went a bit further with this spike and implemented keyboard navigation in the option box with arrow keys, space/enter to select an option and tab/escape to close the dropdown.

### accessibility with trees

One final cool thing I found is that the `aria-controls` of a combobox doesn't have to be a `"listbox"`... it can be a tree!!!

https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tree_role

So we could even make our tree selects nice and friendly to screen readers :)
